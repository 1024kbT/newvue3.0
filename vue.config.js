module.exports = {
        // 部署应用包时的基本 URL,用法和 webpack 本身的 output.publicPath 一致
        publicPath: './',
        // 输出文件目录
        outputDir: 'dist',
        // eslint-loader 是否在保存的时候检查
        lintOnSave: true,
        // 是否使用包含运行时编译器的 Vue 构建版本
        runtimeCompiler: false,
        // 生产环境是否生成 sourceMap 文件
        productionSourceMap: false,
        // 生成的 HTML 中的 <link rel="stylesheet"> 和 <script> 标签上启用 Subresource Integrity (SRI)
        integrity: false,
    }