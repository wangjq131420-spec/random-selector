class RandomSelector {
    constructor() {
        this.numberPool = [];
        this.drawnNumbers = [];
        this.isRolling = false;
        this.rollInterval = null;
        this.currentRollNumber = 0;
        
        this.initializeElements();
        this.reset();
        this.bindEvents();
    }
    
    // 初始化DOM元素
    initializeElements() {
        this.currentNumberElement = document.getElementById('current-number');
        this.statusElement = document.getElementById('status');
        this.startBtn = document.getElementById('start-btn');
        this.stopBtn = document.getElementById('stop-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.drawnNumbersElement = document.getElementById('drawn-numbers');
        this.remainingCountElement = document.getElementById('remaining-count');
    }
    
    // 绑定事件监听器
    bindEvents() {
        this.startBtn.addEventListener('click', () => this.startRolling());
        this.stopBtn.addEventListener('click', () => this.stopRolling());
        this.resetBtn.addEventListener('click', () => this.reset());
    }
    
    // 初始化数字池 (1-36)
    initializeNumberPool() {
        this.numberPool = [];
        for (let i = 1; i <= 36; i++) {
            this.numberPool.push(i);
        }
        // 使用Fisher-Yates洗牌算法打乱顺序，确保每次抽取概率均等
        this.shuffleArray(this.numberPool);
    }
    
    // Fisher-Yates洗牌算法
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            // 随机生成0到i的索引
            const j = Math.floor(Math.random() * (i + 1));
            // 交换元素
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    // 开始滚动
    startRolling() {
        if (this.isRolling || this.numberPool.length === 0) return;
        
        this.isRolling = true;
        this.startBtn.disabled = true;
        this.stopBtn.disabled = false;
        this.statusElement.textContent = '抽奖进行中...';
        this.currentNumberElement.classList.add('rolling');
        
        // 设置滚动间隔，每100毫秒更新一次数字
        this.rollInterval = setInterval(() => {
            // 随机显示1-36的数字（模拟滚动效果）
            this.currentRollNumber = Math.floor(Math.random() * 36) + 1;
            this.updateDisplayNumber(this.currentRollNumber);
        }, 100);
    }
    
    // 停止滚动，抽取数字
    stopRolling() {
        if (!this.isRolling) return;
        
        this.isRolling = false;
        clearInterval(this.rollInterval);
        this.startBtn.disabled = false;
        this.stopBtn.disabled = true;
        
        // 从数字池中抽取一个数字（由于已经洗牌，直接取最后一个即可）
        const selectedNumber = this.numberPool.pop();
        this.drawnNumbers.push(selectedNumber);
        
        // 更新显示
        this.updateDisplayNumber(selectedNumber);
        this.currentNumberElement.classList.remove('rolling');
        this.statusElement.textContent = `恭喜！抽到了 ${selectedNumber} 号`;
        
        // 更新已抽取号码显示
        this.updateDrawnNumbers();
        // 更新剩余数量
        this.updateRemainingCount();
        
        // 如果所有号码都抽完了
        if (this.numberPool.length === 0) {
            this.startBtn.disabled = true;
            this.statusElement.textContent = '所有号码已抽取完毕！';
        }
    }
    
    // 更新显示的数字
    updateDisplayNumber(number) {
        this.currentNumberElement.textContent = number.toString().padStart(2, '0');
    }
    
    // 更新已抽取号码显示
    updateDrawnNumbers() {
        this.drawnNumbersElement.innerHTML = '';
        
        // 按数字大小排序显示
        const sortedNumbers = [...this.drawnNumbers].sort((a, b) => a - b);
        
        sortedNumbers.forEach(number => {
            const numberElement = document.createElement('div');
            numberElement.className = 'number-item';
            numberElement.textContent = number;
            this.drawnNumbersElement.appendChild(numberElement);
        });
    }
    
    // 更新剩余数量
    updateRemainingCount() {
        this.remainingCountElement.textContent = this.numberPool.length;
    }
    
    // 重置系统
    reset() {
        // 停止任何正在进行的滚动
        if (this.isRolling) {
            this.isRolling = false;
            clearInterval(this.rollInterval);
        }
        
        // 重置状态
        this.startBtn.disabled = false;
        this.stopBtn.disabled = true;
        
        // 重新初始化数字池
        this.initializeNumberPool();
        this.drawnNumbers = [];
        
        // 更新显示
        this.updateDisplayNumber(0);
        this.currentNumberElement.classList.remove('rolling');
        this.statusElement.textContent = '点击开始按钮开始抽奖';
        this.updateDrawnNumbers();
        this.updateRemainingCount();
    }
}

// 页面加载完成后初始化抽奖系统
document.addEventListener('DOMContentLoaded', () => {
    new RandomSelector();
});