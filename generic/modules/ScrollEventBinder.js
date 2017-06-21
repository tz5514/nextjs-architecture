export default class ScrollEventBinder {
  flag = 0;
  constructor(options) {
    const {
      target = window,
      range = [0, 'max'], // todo
      bottom = null,
      callback = () => {},
      shouldCallback = () => true
    } = options;

    this.duringCallback = false;

    if (this.event) {
      this.unbind();
    }

    const runCallBack = (scrollTop) => {
      if (shouldCallback() && !this.duringCallback) {
        this.duringCallback = true;
        callback(scrollTop);
        this.duringCallback = false;
      }
    }

    if (target == window || target == document || target == document.body) {
      this.target = window;

      if (bottom) {
        // 捲動到底部時觸發
        this.event = () => {
          if (bottom && document.body.scrollHeight - window.innerHeight - document.body.scrollTop <= bottom) {
            runCallBack(document.body.scrollTop);
          }
        }
      } else {
        // 捲動到指定範圍時觸發
        let [minimum, maximum] = range;
        minimum = (minimum >= 0)? minimum : 0;
        if (maximum != 'max' && maximum < minimum) {
          console.error("The setting maximum value can't be less than minimum value.");
          return;
        }

        this.event = () => {
          if (maximum == 'max' && document.body.scrollTop >= minimum) {
            // 最大值為無限時
            runCallBack(document.body.scrollTop);
          } else if (document.body.scrollTop >= minimum && document.body.scrollTop <= maximum){
            // 有指定最大值時
            runCallBack(document.body.scrollTop);
          }
        }
      }

    } else {
      // todo
      this.target = target;
    }
    this.target.addEventListener('scroll', this.event);
  }

  unbind() {
    this.target.removeEventListener('scroll', this.event);
  }
}
