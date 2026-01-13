// 截图工具核心逻辑
class ScreenshotTool {
    constructor() {
        this.canvas = document.getElementById('screenshotCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.isDrawing = false;
        this.startX = 0;
        this.startY = 0;
        this.currentX = 0;
        this.currentY = 0;
        this.screenshotData = null;
        this.history = [];
        
        this.initEventListeners();
    }
    
    initEventListeners() {
        // 工具栏按钮事件
        document.getElementById('fullScreenBtn').addEventListener('click', () => this.takeFullScreenScreenshot());
        document.getElementById('windowBtn').addEventListener('click', () => this.takeWindowScreenshot());
        document.getElementById('regionBtn').addEventListener('click', () => this.startRegionSelection());
        document.getElementById('cancelBtn').addEventListener('click', () => this.cancelScreenshot());
        
        // 编辑工具栏事件
        document.getElementById('saveBtn').addEventListener('click', () => this.saveScreenshot());
        document.getElementById('copyBtn').addEventListener('click', () => this.copyToClipboard());
        document.getElementById('redoBtn').addEventListener('click', () => this.undo());
        
        // 画布事件
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
    }
    
    async takeFullScreenScreenshot() {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    cursor: 'always'
                },
                audio: false
            });
            
            const video = document.createElement('video');
            video.srcObject = stream;
            await video.play();
            
            this.canvas.width = video.videoWidth;
            this.canvas.height = video.videoHeight;
            this.ctx.drawImage(video, 0, 0);
            
            stream.getTracks().forEach(track => track.stop());
            this.screenshotData = this.canvas.toDataURL();
            this.saveToHistory();
            
            this.showEditToolbar();
        } catch (err) {
            console.error('全屏截图失败:', err);
            alert('截图失败，请重试');
        }
    }
    
    async takeWindowScreenshot() {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    cursor: 'always'
                },
                audio: false
            });
            
            const video = document.createElement('video');
            video.srcObject = stream;
            await video.play();
            
            this.canvas.width = video.videoWidth;
            this.canvas.height = video.videoHeight;
            this.ctx.drawImage(video, 0, 0);
            
            stream.getTracks().forEach(track => track.stop());
            this.screenshotData = this.canvas.toDataURL();
            this.saveToHistory();
            
            this.showEditToolbar();
        } catch (err) {
            console.error('窗口截图失败:', err);
            alert('截图失败，请重试');
        }
    }
    
    startRegionSelection() {
        // 首先获取全屏截图作为背景
        this.takeFullScreenScreenshot().then(() => {
            // 启用区域选择模式
            this.canvas.style.cursor = 'crosshair';
            this.isDrawing = false;
        });
    }
    
    startDrawing(e) {
        if (this.canvas.style.cursor !== 'crosshair') return;
        
        this.isDrawing = true;
        this.startX = e.offsetX;
        this.startY = e.offsetY;
        this.currentX = this.startX;
        this.currentY = this.startY;
    }
    
    draw(e) {
        if (!this.isDrawing || this.canvas.style.cursor !== 'crosshair') return;
        
        this.currentX = e.offsetX;
        this.currentY = e.offsetY;
        
        // 重新绘制原始截图
        const img = new Image();
        img.src = this.screenshotData;
        img.onload = () => {
            this.ctx.drawImage(img, 0, 0);
            
            // 绘制选择区域
            this.ctx.strokeStyle = '#1890ff';
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([5, 5]);
            
            const width = this.currentX - this.startX;
            const height = this.currentY - this.startY;
            this.ctx.strokeRect(this.startX, this.startY, width, height);
        };
    }
    
    stopDrawing() {
        if (!this.isDrawing || this.canvas.style.cursor !== 'crosshair') return;
        
        this.isDrawing = false;
        this.canvas.style.cursor = 'default';
        
        // 裁剪选中区域
        const width = this.currentX - this.startX;
        const height = this.currentY - this.startY;
        
        if (width <= 0 || height <= 0) {
            alert('请选择有效的区域');
            return;
        }
        
        // 创建新画布用于裁剪
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        
        tempCanvas.width = Math.abs(width);
        tempCanvas.height = Math.abs(height);
        
        // 确定裁剪区域的起始点
        const x = Math.min(this.startX, this.currentX);
        const y = Math.min(this.startY, this.currentY);
        
        // 裁剪图片
        tempCtx.drawImage(this.canvas, x, y, Math.abs(width), Math.abs(height), 0, 0, Math.abs(width), Math.abs(height));
        
        // 更新主画布
        this.canvas.width = tempCanvas.width;
        this.canvas.height = tempCanvas.height;
        this.ctx.drawImage(tempCanvas, 0, 0);
        
        this.screenshotData = this.canvas.toDataURL();
        this.saveToHistory();
        
        this.showEditToolbar();
    }
    
    cancelScreenshot() {
        this.clearCanvas();
        this.screenshotData = null;
        this.hideEditToolbar();
    }
    
    saveScreenshot() {
        if (!this.screenshotData) return;
        
        // 检查是否在飞书环境中
        if (window.fsTable) {
            // 在飞书环境中，询问用户是保存到本地还是插入到表格
            const choice = confirm('是否将截图插入到当前选中的飞书多维表格单元格？\n\n点击"确定"插入到表格，点击"取消"保存到本地');
            
            if (choice) {
                // 插入到飞书多维表格
                insertScreenshotToFeishuTable(this.screenshotData);
            } else {
                // 保存到本地
                this.downloadScreenshot();
            }
        } else {
            // 不在飞书环境中，直接保存到本地
            this.downloadScreenshot();
        }
    }
    
    // 下载截图到本地
    downloadScreenshot() {
        const link = document.createElement('a');
        link.download = `screenshot_${new Date().getTime()}.png`;
        link.href = this.screenshotData;
        link.click();
    }
    
    async copyToClipboard() {
        if (!this.screenshotData) return;
        
        try {
            const blob = await (await fetch(this.screenshotData)).blob();
            await navigator.clipboard.write([
                new ClipboardItem({
                    [blob.type]: blob
                })
            ]);
            alert('截图已复制到剪贴板');
        } catch (err) {
            console.error('复制失败:', err);
            alert('复制失败，请重试');
        }
    }
    
    undo() {
        if (this.history.length > 1) {
            this.history.pop();
            const lastState = this.history[this.history.length - 1];
            
            const img = new Image();
            img.src = lastState;
            img.onload = () => {
                this.canvas.width = img.width;
                this.canvas.height = img.height;
                this.ctx.drawImage(img, 0, 0);
                this.screenshotData = lastState;
            };
        }
    }
    
    saveToHistory() {
        this.history.push(this.screenshotData);
        if (this.history.length > 10) {
            this.history.shift(); // 保留最近10次操作
        }
    }
    
    showEditToolbar() {
        document.querySelector('.edit-toolbar').style.display = 'flex';
    }
    
    hideEditToolbar() {
        document.querySelector('.edit-toolbar').style.display = 'none';
    }
    
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvas.width = 0;
        this.canvas.height = 0;
    }
}

// 飞书插件初始化
function initFeishuPlugin() {
    // 检查是否在飞书环境中
    if (window.fsconfig) {
        console.log('飞书插件环境检测到');
        
        // 注册飞书多维表格事件
        if (window.fsTable) {
            window.fsTable.on('ready', () => {
                console.log('飞书多维表格准备就绪');
                
                // 为飞书多维表格添加截图按钮
                addScreenshotButtonToFeishuTable();
            });
        }
    }
}

// 在飞书多维表格中添加截图按钮
function addScreenshotButtonToFeishuTable() {
    // 创建截图按钮
    const screenshotBtn = document.createElement('button');
    screenshotBtn.textContent = '截图';
    screenshotBtn.className = 'feishu-screenshot-btn';
    screenshotBtn.style.cssText = `
        padding: 6px 12px;
        background-color: #1890ff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        margin: 0 5px;
    `;
    
    // 绑定点击事件
    screenshotBtn.addEventListener('click', () => {
        // 显示截图工具
        document.querySelector('.screenshot-tool').style.display = 'block';
    });
    
    // 查找飞书多维表格的工具栏并添加按钮
    // 这里需要根据实际的飞书多维表格DOM结构进行调整
    const toolbar = document.querySelector('.bit-table-toolbar') || 
                   document.querySelector('.table-toolbar') ||
                   document.querySelector('[class*="toolbar"]');
    
    if (toolbar) {
        toolbar.appendChild(screenshotBtn);
    } else {
        // 如果找不到工具栏，将按钮添加到页面顶部
        document.body.insertBefore(screenshotBtn, document.body.firstChild);
    }
}

// 将截图插入到飞书多维表格
async function insertScreenshotToFeishuTable(imageData) {
    if (!window.fsTable) return;
    
    try {
        // 获取当前选中的单元格
        const selectedCell = await window.fsTable.getActiveCell();
        if (selectedCell) {
            // 将截图数据插入到选中单元格
            await window.fsTable.setCellValue({
                rowId: selectedCell.rowId,
                fieldId: selectedCell.fieldId,
                value: imageData
            });
            console.log('截图已插入到飞书多维表格');
        }
    } catch (err) {
        console.error('插入截图到飞书多维表格失败:', err);
        alert('插入截图失败，请重试');
    }
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', () => {
    new ScreenshotTool();
    initFeishuPlugin();
});