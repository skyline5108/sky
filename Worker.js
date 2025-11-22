export default {
  /**
   * Cloudflare Worker 的主要请求处理函数。
   * @param {Request} request 传入的请求对象
   * @param {Object} env 环境配置对象
   * @param {Object} ctx 上下文对象
   */
  async fetch(request, env, ctx) {
    // ✅ 静态内容源地址 (固定指向 R2 上的特定 M3U 文件)
    // 无论 OTT 播放器请求什么路径 (例如 worker.domain/foo 或 worker.domain/bar)，
    // 最终都会去请求并返回此固定文件的内容。
    const CONTENT_SOURCE_URL = "https://pub-3b1b42ae8adb483cb2455c8ee77143d5.r2.dev/pl.m3u";

    // 🚫 其它访问者要重定向去的地址
    const REDIRECT_URL = "https://life4u22.blogspot.com/p/ott-channel-review.html";

    // 读取 User-Agent
    const ua = request.headers.get("User-Agent") || "";

    // ✅ 判断是否是 OTT Player（根据 UA 关键字匹配）
    const ottKeywords = ["OTT Player", "OTT TV", "OTT Navigator"];
    const isOTT = ottKeywords.some(keyword => ua.includes(keyword));

    if (isOTT) {
      // 允许访问，直接转发到固定的 R2 文件地址
      const target = CONTENT_SOURCE_URL; 
      
      const response = await fetch(target, {
        method: request.method,
        headers: request.headers,
      });
      return response;
    } else {
      // 非 OTT Player → 302 跳转到指定网站
      return Response.redirect(REDIRECT_URL, 302);
    }
  },
};
