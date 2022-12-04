class InputKnob {
    constructor(container, inputValue, inputMin, inputMax, step, decimals = 10, newValue_callback = value => null, exponentialRangeExponent = 1) {
        this.container = container;
        this.container.innerHTML = `<canvas width="${window.getComputedStyle(container).width}" height="${window.getComputedStyle(container).height}"></canvas><span>${inputValue}</span><input type="number" class="hidden">`;
        this.canvas = this.container.querySelector("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.span = this.container.querySelector("span");
        this.numInput = this.container.querySelector("input");
        this.value;
        this.min = inputMin;
        this.max = inputMax;
        this.step = step;
        this.exponent = exponentialRangeExponent;
        this.callback = newValue_callback;
        this.decimals = decimals;
        this.lmbDown = false;
        this.isClick = false;
        this.numInputActive = false;
        this.numInputActiveTimeout = null;
        this.center = { x: 0, y: 0 };
        this.update(inputValue, this.exponent != 1 ? Math.pow((inputValue - this.min) / (this.max - this.min), 1 / this.exponent) : null);

        this.container.addEventListener("mousedown", e => {
            if (!this.numInputActive) {
                this.lmbDown = this.isClick = true;
                const bounds = this.container.getBoundingClientRect();
                this.center.x = bounds.x + bounds.width / 2;
                this.center.y = bounds.y + bounds.height / 2;
                e.preventDefault();
            }
        });
        window.addEventListener("mouseup", () => {
            this.lmbDown = false;
        });
        window.addEventListener("mousemove", e => {
            if (this.lmbDown && !this.numInputActive) {
                this.isClick = false;
                let angle = Math.atan2(this.center.y - e.clientY, this.center.x - e.clientX) + Math.PI / 2;
                if (angle < 0)
                    angle += Math.PI * 2;

                const rangeValue = angle / (Math.PI * 2),
                    newValue = Math.pow(rangeValue, this.exponent) * (this.max - this.min);

                this.update(Math.round(newValue / step) * step + this.min, this.exponent != 1 ? rangeValue : null);

                if (this.callback)
                    this.callback(this.value);
            }
        });

        this.container.addEventListener("click", () => {
            if (this.isClick && !this.numInputActive) {
                this.span.classList.add("hidden");
                this.numInput.classList.remove("hidden");
                this.numInput.value = this.value;
                this.numInputActive = true;

                this.numInputActiveTimeout = setTimeout(() => {
                    this.span.classList.remove("hidden");
                    this.numInput.classList.add("hidden");
                    this.numInputActive = false;
                }, 500);
            }
        });
        this.container.addEventListener("dblclick", () => {
            clearTimeout(this.numInputActiveTimeout);
        });
        this.numInput.addEventListener("blur", () => {
            this.span.classList.remove("hidden");
            this.numInput.classList.add("hidden");
            this.numInputActive = false;
        });
        this.numInput.addEventListener("change", () => {
            this.span.classList.remove("hidden");
            this.numInput.classList.add("hidden");
            this.numInputActive = false;
            this.update(this.numInput.value);
            if (this.callback)
                this.callback(this.value);
        });
    }

    update(newValue, rangeValue = null) {
        this.span.innerHTML = this.value = newValue > this.max ? this.max : newValue < this.min ? this.min : Math.round(newValue * Math.pow(10, this.decimals)) / Math.pow(10, this.decimals);

        if (rangeValue == null)
            rangeValue = (this.value / (this.max - this.min)) - (this.min / (this.max - this.min));

        this.ctx.lineWidth = 8;
        this.ctx.fillStyle = "#000";
        this.ctx.strokeStyle = "#0af";
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.beginPath();
        this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, this.canvas.width / 2, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, this.canvas.width / 2 - 8, Math.PI / 2, rangeValue * (Math.PI * 2) + (Math.PI / 2));
        this.ctx.stroke();
        this.ctx.fillStyle = "#fff";
        this.ctx.fillRect(this.canvas.width / 2 - 2, this.canvas.height - 12, 4, 8);
    }
}