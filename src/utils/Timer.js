// 计时器

/*
  usage:
    // 生成计时器
    let timer = new Timer(60)

    // 开始计时
    timer.start()
    
    // 从特定时间计时
    timer.start(time)

    // 读取时间
    console.log(timer.running, timer.time)

    // 结束计时
    timer.clear()
    
*/ 

class Timer{
  constructor(time = 60) {
    this.baseTime = time
    this.time = time
    this.running = false
  }
  start(time) {
    this.time = time || this.baseTime
    this.running = true
    this.interval = setInterval(() => {
      this.time--
      if(this.time <= 0) {
        this.clear()
      }
    }, 1000);
  }
  clear() {
    this.running = false
    clearInterval(this.interval)
  }
}

export default Timer
