let baseUrl = "";
let env = process.env.VUE_APP_TITLE === 'alpha' ? 'alpha' : 'production';
switch (env) {
  case 'production':
    baseUrl = "http://192.168.102.118:8866"; // 测试环境
    // baseUrl = "http://192.168.101.205:8086"; // 测试环境
    // baseUrl = "http://192.168.102.97:8086"; // 陈
    // baseUrl = "http://192.168.101.69:8081"; // 测试环境
    // baseUrl = "http://192.168.101.205:8086"; // 测试环境
    // baseUrl = "http://192.168.102.97:8086"; // 陈
    // baseUrl = "http://192.168.101.69:8081"; // 徐阳
    // baseUrl = "http://192.168.101.205:8086/activities"
    break;
  case 'alpha':
    baseUrl = "http://127.0.0.1:8080"; // 阿里云环境
    break;
}
export default baseUrl;
