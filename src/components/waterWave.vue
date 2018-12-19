<script>
export default {
  data () {
    class Wave {
      constructor ({
        canvasWidth,
        canvasHeight,
        waveWidth,
        waveHeight,
        xOffset = 0,
        speed = 0.04,
        colors = ['rgba(47, 160, 240, 0.6)', 'rgba(47, 160, 240, 0.9)']
      } = {}) {
        this.canvasWidth = canvasWidth
        this.canvasHeight = canvasHeight
        this.waveWidth = waveWidth
        this.waveHeight = waveHeight
        this.xOffset = xOffset
        this.xStart = 0
        this.speed = speed
        this.colors = colors
        this.points = (() => {
          let points = []
          let {canvasWidth, canvasHeight, waveWidth, waveHeight, xStart, xOffset} = this
          for (let x = xStart; x < xStart + canvasWidth; x += 0.5) {
            const y = waveHeight * Math.cos((2 * 3.1415926 / waveWidth) * x + xOffset) + canvasHeight
            points.push([x, y])
          }
          return points
        })()
      }
      addColor (ctx) {
        const rStart = { x: this.canvasWidth / 2, y: this.canvasWidth / 2 }
        const rEnd = { x: this.canvasWidth / 2, y: this.canvasHeight }
        const grd = ctx.createLinearGradient(rStart.x, rStart.y, rEnd.x, rEnd.y)
        grd.addColorStop(0, this.colors[0])
        grd.addColorStop(1, this.colors[1])
        return grd
      }
      draw (ctx) {
        ctx.save()
        const points = this.points
        ctx.beginPath()
        for (let point of points) {
          ctx.lineTo(point[0], point[1])
        }
        ctx.lineTo(this.canvasWidth, this.canvasHeight)
        ctx.lineTo(0, this.canvasHeight)
        ctx.lineTo(points[0][0], points[0][1])
        ctx.fillStyle = this.addColor(ctx)
        ctx.fill()
        ctx.restore()
      }
      update ({
        percent
      } = {}) {
        this.xOffset += this.speed
        let {waveWidth, waveHeight, xOffset, canvasHeight} = this
        for (let index in this.points) {
          this.points[index][1] = waveHeight * Math.cos((2 * 3.1415926 / waveWidth) * this.points[index][0] + xOffset) + canvasHeight * (1 - percent / 100)
        }
      }
    }
    return {
      done: false,
      wave1: new Wave({
        canvasWidth: this.canvasWidth,
        canvasHeight: this.canvasHeight,
        waveWidth: this.canvasWidth / 2.5,
        waveHeight: this.canvasHeight / 35,
        speed: 0.1
      }),
      wave2: new Wave({
        canvasWidth: this.canvasWidth,
        canvasHeight: this.canvasHeight,
        waveWidth: this.canvasWidth / 2.5,
        waveHeight: this.canvasHeight / 50,
        xOffset: -0.5,
        colors: ['rgba(47, 160, 240, 0.3)', 'rgba(47, 160, 240, 0.8)'],
        speed: 0.1
      }),
      percent: 0,
      canvasAttrs: {
        width: this.canvasWidth,
        height: this.canvasHeight
      }
    }
  },
  props: {
    canvasWidth: {type: Number, required: true},
    canvasHeight: {type: Number, required: true},
    realLoadPercent: {type: Boolean, default: false}
  },
  watch: {
    percent () {
      if (this.percent > 105) {
        this.$emit('canvasFinish')
      }
    }
  },
  methods: {
    draw () {
      const ctx = this.$el.getContext('2d')
      ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
      if (!this.realLoadPercent) {
      // this.realLoadPercent为true，是真实加载进度，否则是假进度
        if (!this.done) {
          if (this.percent < 20) {
            this.percent += 0.1
          } else if (this.percent > 20 && this.percent < 40) {
            this.percent += 0.08
          } else if (this.percent > 40 && this.percent < 60) {
            this.percent += 0.06
          } else if (this.percent > 60 && this.percent < 80) {
            this.percent += 0.04
          } else if (this.percent > 80 && this.percent < 95) {
            this.percent += 0.02
          }
        } else {
          if (this.percent < 110) {
            this.percent += 0.8
          }
        }
      }
      this.wave1.update({percent: this.percent})
      this.wave1.draw(ctx)
      this.wave2.update({percent: this.percent})
      this.wave2.draw(ctx)
      // let fontSize = this.canvasWidth / 5
      // ctx.font = fontSize + 'px Arial'
      // ctx.textAlign = 'center'
      // ctx.textBaseline = 'middle'
      // let percentShow = this.percent >= 100 ? 100 : this.percent
      // ctx.fillText(`${Math.floor(percentShow)}%`, this.canvasWidth / 2, this.canvasHeight / 2)
      window.requestAnimationFrame(this.draw.bind(this))
    }
  },
  mounted () {
    this.draw()
  },
  render (h) {
    const {canvasAttrs: attrs} = this
    return h('canvas', {attrs})
  }
}
</script>
