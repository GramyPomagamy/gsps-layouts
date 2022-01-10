<template>
    <div>
        <div id="chart"></div>

        <div id="winningOptionName" class="name"></div>
        <div id="winningOptionAmount" class="amount"></div>
        <div id="losingOptionAmount" class="amount"></div>
        <div id="losingOptionName" class="name"></div>
    </div>
</template>

<script>
    import SVG from 'svg.js'
    import gsap from 'gsap'
    import fitty from 'fitty'

    export default {
        name: 'BidChoiceBinary',
        props: ['bid'],
        data() {
            return {
                _svgDoc: undefined,
                _secondSlice: undefined,
            }
        },
        methods: {
            initPieChart() {
                const svgDoc = SVG(document.getElementById('chart'))
                svgDoc.viewbox(-1, -1, 2, 2)
                this._svgDoc = svgDoc

                svgDoc.circle(2).fill({ color: '#3A008B' }).move(-1, -1)
                this._secondSlice = svgDoc.path().fill({ color: '#21004F' })
            },
            animate() {
                const tl = new gsap.timeline()
                const winningPercent =
                    this.bid.options[0].rawTotal / this.bid.rawTotal
                const proxy = { percent: 0 }

                tl.call(
                    () => {
                        document.getElementById(
                            'winningOptionAmount'
                        ).innerText =
                            this.bid.options[0].rawTotal.toLocaleString(
                                'en-US',
                                {
                                    maximumFractionDigits: 0,
                                    useGrouping: false,
                                }
                            ) + ' PLN'
                        document.getElementById(
                            'losingOptionAmount'
                        ).innerText =
                            this.bid.options[1].rawTotal.toLocaleString(
                                'en-US',
                                {
                                    maximumFractionDigits: 0,
                                    useGrouping: false,
                                }
                            ) + ' PLN'
                    },
                    null,
                    null,
                    '+=0.03'
                )

                tl.addLabel('amounts')

                tl.to(
                    ['#winningOptionAmount', '#losingOptionAmount'],
                    0.384,
                    {
                        opacity: 1,
                        x: 0,
                        ease: 'Sine.easeOut',
                    },
                    'amounts'
                )

                tl.to(
                    ['#winningOptionAmount', '#losingOptionAmount'],
                    0.384,
                    {
                        color: 'white',
                        textShadow: '2px 2px 8px #000000',
                        ease: 'Sine.easeOut',
                    },
                    'amounts'
                )

                tl.to(this._svgDoc.node, 0.465, {
                    opacity: 1,
                    ease: 'Sine.easeInOut',
                })

                tl.to(proxy, 1, {
                    percent: winningPercent,
                    ease: 'Power3.easeInOut',
                    callbackScope: this,
                    onStart() {
                        this._svgDoc.style({ transform: `rotate(0.65turn)` })

                        document.getElementById('winningOptionName').innerText =
                            this.bid.options[0].name ||
                            this.bid.options[0].description
                        document.getElementById('losingOptionName').innerText =
                            this.bid.options[1].name ||
                            this.bid.options[1].description
                    },
                    onUpdate() {
                        this.drawSecondSlice(proxy.percent)
                    },
                })

                tl.call(
                    () => {
                        setTimeout(() => {
                            this.$emit('end')
                        }, 5000)
                    },
                    null,
                    null
                )
            },
            drawSecondSlice(percent) {
                // Note the svg viewBox is offset so the center of the SVG is 0,0.
                const arcLength = 2 * Math.PI * percent

                const startX = Math.cos(arcLength / -2)
                const startY = Math.sin(arcLength / -2)
                const endX = Math.cos(arcLength / 2)
                const endY = Math.sin(arcLength / 2)
                const largeArcFlag = percent > 0.5 ? 1 : 0

                const d = [
                    `M ${startX} ${startY}`,
                    `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                    'L 0 0',
                ].join(` `)

                this._secondSlice.plot(d)
            },
        },
        mounted() {
            this.initPieChart()
            gsap.set('#winningOptionAmount', {
                opacity: 0,
                x: -36,
                color: 'transparent',
                textColor: 'transparent',
            })
            gsap.set('#losingOptionAmount', {
                opacity: 0,
                x: 36,
                color: 'transparent',
                textColor: 'transparent',
            })
            gsap.set(this._svgDoc.node, { opacity: 0 })
            this.animate()
            setTimeout(() => {
                fitty('#winningOptionAmount', { maxSize: 67 })
                fitty('#losingOptionAmount', { maxSize: 58 })
            }, 300)
        },
    }
</script>

<style scoped>
    html {
        display: block;
        position: relative;
        color: white;
        height: 348px;
    }

    #chart {
        position: absolute;
        top: -16px;
        left: 308.4px;
        width: 385.2px;
        height: 240px;
        opacity: 0.5;
    }

    #winningOptionName {
        top: 12px;
        left: 42px;
    }

    #winningOptionAmount {
        top: 43.2px;
        left: 0;
        height: 122.4px;
        padding: 0 21.6px 0 33.6px;
    }

    #losingOptionAmount {
        top: 43.2px;
        right: -20px;
        height: 88.8px;
        padding: 0 38.4px 0 24px;
        font-size: 57.6px;
    }

    #losingOptionName {
        top: 12px;
        right: 55px;
    }

    .name {
        position: absolute;
        font-size: 19.2px;
        font-weight: 400;
        text-transform: uppercase;
        z-index: 1;
        will-change: opacity, transform;
    }

    .amount {
        position: absolute;
        font-size: 67.2px;
        font-weight: 400;
        line-height: 1;
        z-index: 1;
    }
</style>
