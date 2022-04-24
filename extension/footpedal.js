"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_1 = require("./util/nodecg");
const tagged_logger_1 = require("./util/tagged-logger");
const router = (0, nodecg_1.get)().Router();
const config = (0, nodecg_1.get)().bundleConfig.footpedal;
const log = new tagged_logger_1.TaggedLogger('footpedal');
router.get('/makeHighlight', (req, res) => {
    if (config.enabled) {
        res.send('OK!');
        (0, nodecg_1.get)().sendMessage('makeHighlight');
    }
    else {
        res.send('Przełącznik jest wyłączony w konfiguracji');
        log.info('Przełącznik jest wyłączony w konfiguracji');
    }
});
router.get('/switchFromHostScreen', (req, res) => {
    if (config.enabled) {
        res.send('OK!');
        (0, nodecg_1.get)().sendMessage('switchFromHostScreen');
    }
    else {
        res.send('Przełącznik jest wyłączony w konfiguracji');
        log.info('Przełącznik jest wyłączony w konfiguracji');
    }
});
(0, nodecg_1.get)().mount(router);
