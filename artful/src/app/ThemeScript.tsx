// 시스템 다크모드 자동 감지 — FOUC 방지를 위해 <head>에서 동기 실행
export function ThemeScript() {
  const script = `
    (function() {
      try {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
          if (e.matches) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        });
      } catch(e) {}
    })();
  `
  return <script dangerouslySetInnerHTML={{ __html: script }} />
}
