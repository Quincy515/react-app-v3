export default function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    // 判断浏览器是否支持 service workers 支持就添加事件监听器

    window.addEventListener('load', () => {
      // 注册一个叫sw.js的service worker文件

      navigator.serviceWorker.register('/sw.js').then((registration) => { // 注册成功
        console.log('SW registered: ', registration); // eslint-disable-line
      }).catch((registrationError) => { // 注册失败
        console.error('SW registration failed: ', registrationError); // eslint-disable-line
      })
    })
  }
}
