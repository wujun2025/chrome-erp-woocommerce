/**
 * API连接测试脚本
 * 用于验证后端服务是否正常运行
 */

async function testApiConnection() {
    const apiUrl = 'http://192.168.31.76:3005';
    
    console.log('开始测试API连接...');
    console.log(`API地址: ${apiUrl}`);
    
    try {
        // 测试根路径
        console.log('\n1. 测试根路径...');
        const rootResponse = await fetch(`${apiUrl}/`);
        const rootData = await rootResponse.json();
        console.log('✓ 根路径测试成功');
        console.log(`  版本: ${rootData.version}`);
        console.log(`  消息: ${rootData.message}`);
        
        // 测试广告接口
        console.log('\n2. 测试广告接口...');
        const adsResponse = await fetch(`${apiUrl}/api/ads`);
        const adsData = await adsResponse.json();
        console.log('✓ 广告接口测试成功');
        console.log(`  广告数量: ${adsData.data.length}`);
        
        // 测试消息接口
        console.log('\n3. 测试消息接口...');
        const messagesResponse = await fetch(`${apiUrl}/api/messages?username=testuser`);
        const messagesData = await messagesResponse.json();
        console.log('✓ 消息接口测试成功');
        console.log(`  消息数量: ${messagesData.data.length}`);
        
        // 测试反馈接口
        console.log('\n4. 测试反馈接口...');
        const feedbackResponse = await fetch(`${apiUrl}/api/feedback/admin`);
        const feedbackData = await feedbackResponse.json();
        console.log('✓ 反馈接口测试成功');
        console.log(`  反馈数量: ${feedbackData.data.length}`);
        
        console.log('\n🎉 所有API测试通过！');
        console.log('后端服务运行正常，可以在Chrome插件中配置API地址了。');
        
    } catch (error) {
        console.error('❌ API测试失败:', error.message);
        console.error('请检查以下事项：');
        console.error('1. 后端服务是否正在运行');
        console.error('2. IP地址和端口是否正确');
        console.error('3. 防火墙是否允许连接');
    }
}

// 执行测试
testApiConnection();

export { testApiConnection };