"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_1 = require("./util/nodecg");
const tagged_logger_1 = require("./util/tagged-logger");
const deep_equal_1 = __importDefault(require("deep-equal"));
const numeral_1 = __importDefault(require("numeral"));
const request_promise_1 = __importDefault(require("request-promise"));
const bluebird_1 = __importDefault(require("bluebird"));
const bidsLog = new tagged_logger_1.TaggedLogger('bids');
const config = (0, nodecg_1.get)().bundleConfig.tracker;
const rootURL = config.rootURL;
const eventID = config.eventID;
const POLL_INTERVAL = 20 * 1000;
const BIDS_URL = `${rootURL}/search?type=allbids&event=${eventID}`;
const CURRENT_BIDS_URL = `${rootURL}/search?type=allbids&event=${eventID}&state=OPENED`;
const currentBidsRep = (0, nodecg_1.get)().Replicant('currentBids', {
    defaultValue: [],
});
const allBidsRep = (0, nodecg_1.get)().Replicant('allBids', { defaultValue: [] });
let updateTimeout;
// Get latest bid data every POLL_INTERVAL milliseconds
update();
/**
 * Grabs the latest bids from the Tracker.
 * @returns {Promise} - A Q.all promise.
 */
function update() {
    (0, nodecg_1.get)().sendMessage('bids:updating');
    clearTimeout(updateTimeout);
    const currentPromise = (0, request_promise_1.default)({
        uri: CURRENT_BIDS_URL,
        json: true,
    });
    const allPromise = (0, request_promise_1.default)({
        uri: BIDS_URL,
        json: true,
    });
    return bluebird_1.default.all([currentPromise, allPromise])
        .then(([currentBidsJSON, allBidsJSON]) => {
        const currentBids = processRawBids(currentBidsJSON);
        const allBids = processRawBids(allBidsJSON);
        // Bits incentives are always marked as "hidden", so they will never show in "current".
        // We must manually add them to "current".
        allBids.forEach((bid) => {
            if (!bid.isBitsChallenge) {
                return;
            }
            const bidAlreadyExistsInCurrentBids = currentBids.find((currentBid) => currentBid.id === bid.id);
            if (!bidAlreadyExistsInCurrentBids) {
                currentBids.unshift(bid);
            }
        });
        if (!(0, deep_equal_1.default)(allBidsRep.value, allBids)) {
            allBidsRep.value = allBids;
        }
        if (!(0, deep_equal_1.default)(currentBidsRep.value, currentBids)) {
            currentBidsRep.value = currentBids;
        }
    })
        .catch((err) => {
        bidsLog.error('Error updating bids:', err);
    })
        .finally(() => {
        (0, nodecg_1.get)().sendMessage('bids:updated');
        updateTimeout = setTimeout(update, POLL_INTERVAL);
    });
}
function processRawBids(bids) {
    // The response from the tracker is flat. This is okay for donation incentives, but it requires
    // us to do some extra work to figure out what the options are for donation wars that have multiple
    // options.
    const parentBidsById = [];
    const childBids = [];
    bids.sort(sortBidsByEarliestEndTime).forEach((bid) => {
        if (bid.fields.state.toLowerCase() === 'denied' ||
            bid.fields.state.toLowerCase() === 'pending') {
            return;
        }
        // If this bid is an option for a donation war, add it to childBids array.
        // Else, add it to the parentBidsById object.
        if (bid.fields.parent) {
            childBids.push(bid);
        }
        else {
            // Format the bid to clean up unneeded cruft.
            const formattedParentBid = {
                id: bid.pk,
                name: bid.fields.name,
                description: bid.fields.shortdescription ||
                    `No shortdescription for bid #${bid.pk}`,
                longDescription: bid.fields.description || `No description for bid #${bid.pk}`,
                total: parseFloat(bid.fields.total.toString()) + ' zł',
                rawTotal: parseFloat(bid.fields.total.toString()),
                state: bid.fields.state,
                game: bid.fields.speedrun__display_name,
                category: bid.fields.speedrun__category,
                runStartTime: Date.parse(bid.fields.speedrun__starttime),
                runEndTime: Date.parse(bid.fields.speedrun__endtime),
                public: bid.fields.public,
                allowUserOptions: bid.fields.allowuseroptions,
            };
            // If this parent bid is not a target, that means it is a donation war that has options.
            // So, we should add an options property that is an empty array,
            // which we will fill in the next step.
            // Else, add the "goal" field to the formattedParentBid.
            if (bid.fields.istarget === false) {
                formattedParentBid.options = [];
            }
            else {
                const goal = parseFloat(bid.fields.goal.toString());
                formattedParentBid.goalMet = bid.fields.total >= bid.fields.goal;
                if (formattedParentBid.isBitsChallenge) {
                    formattedParentBid.goal = (0, numeral_1.default)(goal * 100).format('0,0');
                    formattedParentBid.rawGoal = parseFloat((goal * 100).toString());
                    formattedParentBid.rawTotal = formattedParentBid.rawGoal;
                    formattedParentBid.total = (0, numeral_1.default)(formattedParentBid.rawTotal).format('0,0');
                    formattedParentBid.goalMet =
                        formattedParentBid.rawTotal >= formattedParentBid.rawGoal;
                    formattedParentBid.state = formattedParentBid.goalMet
                        ? 'CLOSED'
                        : 'OPENED';
                }
                else {
                    formattedParentBid.goal =
                        parseFloat(bid.fields.goal.toString()) + ' zł';
                    formattedParentBid.rawGoal = goal;
                }
            }
            parentBidsById[bid.pk] = formattedParentBid;
        }
    });
    // Now that we have a big array of all child bids (i.e., donation war options), we need
    // to assign them to their parents in the parentBidsById object.
    childBids.forEach((bid) => {
        const formattedChildBid = {
            id: bid.pk,
            parent: bid.fields.parent,
            name: bid.fields.name,
            description: bid.fields.shortdescription,
            speedrun: bid.fields.speedrun,
            total: parseFloat(bid.fields.total) + ' zł',
            rawTotal: parseFloat(bid.fields.total),
        };
        const parent = parentBidsById[bid.fields.parent];
        if (parent) {
            parentBidsById[bid.fields.parent].options.push(formattedChildBid);
        }
        else {
            bidsLog.error("Child bid #%d's parent (bid #%s) could not be found." +
                ' This child bid will be discarded!', bid.pk, bid.fields.parent);
        }
    });
    // Ah, but now we have to sort all these child bids by how much they have raised so far!
    // While we're at it, map all the parent bids back onto an array and set their "type".
    let bidsArray = [];
    for (const id in parentBidsById) {
        if (!{}.hasOwnProperty.call(parentBidsById, id)) {
            continue;
        }
        const bid = parentBidsById[id];
        bid.type = (function () {
            if (bid.options) {
                if (bid.options.length === 2) {
                    return 'choice-binary';
                }
                return 'choice-many';
            }
            return 'challenge';
        })();
        bidsArray.push(bid);
        if (!bid.options) {
            continue;
        }
        bid.options = bid.options.sort((a, b) => {
            const aTotal = a.rawTotal;
            const bTotal = b.rawTotal;
            if (aTotal > bTotal) {
                return -1;
            }
            if (aTotal < bTotal) {
                return 1;
            }
            // a must be equal to b
            return 0;
        });
    }
    // Yes, we need to now sort again.
    bidsArray = bidsArray.sort(sortBidsByEarliestEndTime);
    return bidsArray;
}
function sortBidsByEarliestEndTime(a, b) {
    // Raw format from tracker.
    if (a.fields && b.fields) {
        return (Date.parse(a.fields.speedrun__endtime) -
            Date.parse(b.fields.speedrun__endtime));
    }
    // Else, format from our own code.
    return a.runEndTime - b.runEndTime;
}
(0, nodecg_1.get)().listenFor('updateBids', update);
