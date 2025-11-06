class DataProcessor {
    constructor() {
        this.data = [];
    }

    // 添加数据
    addData(item) {
        this.data.push(item);
        console.log(`已添加数据: ${JSON.stringify(item)}`);
    }

    // 处理数据
    processData() {
        return this.data.map(item => {
            if (typeof item === 'string') {
                return item.toUpperCase();
            }
            if (typeof item === 'number') {
                return item * 2;
            }
            return item;
        });
    }

    // 获取统计信息
    getStats() {
        const stats = {
            total: this.data.length,
            strings: this.data.filter(item => typeof item === 'string').length,
            numbers: this.data.filter(item => typeof item === 'number').length,
            others: this.data.filter(item => typeof item !== 'string' && typeof item !== 'number').length
        };
        
        console.log('数据统计:', stats);
        return stats;
    }
}

// 使用示例
const processor = new DataProcessor();
processor.addData('hello');
processor.addData(42);
processor.addData('world');
processor.addData(100);

const processed = processor.processData();
console.log('处理后的数据:', processed);

const stats = processor.getStats();