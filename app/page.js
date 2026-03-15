export default function Home() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🎨 Nano Banana Pro</h1>
      
      <div style={styles.card}>
        <div style={styles.settings}>
          <div style={styles.formGroup}>
            <label style={styles.label}>API 地址</label>
            <input type="text" id="apiUrl" placeholder="https://api.example.com/v1/images/generations" style={styles.input} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>API 密钥</label>
            <input type="password" id="apiKey" placeholder="sk-..." style={styles.input} />
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>图像描述</label>
          <textarea id="prompt" placeholder="描述你想要生成的图像，例如：一只穿着宇航服的猫咪在月球上" style={styles.textarea}></textarea>
        </div>

        <div style={styles.row}>
          <div style={styles.formGroup}>
            <label style={styles.label}>尺寸</label>
            <select id="size" style={styles.select}>
              <option value="1024x1024">正方形 (1024×1024)</option>
              <option value="1024x1792">竖版 (1024×1792)</option>
              <option value="1792x1024">横版 (1792×1024)</option>
              <option value="512x512">小图 (512×512)</option>
            </select>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>风格</label>
            <select id="style" style={styles.select}>
              <option value="vivid">鲜艳 (Vivid)</option>
              <option value="natural">自然 (Natural)</option>
            </select>
          </div>
        </div>

        <button onClick={generate} id="generateBtn" style={styles.button}>
          🚀 生成图像
        </button>

        <div id="loading" style={styles.loading}>
          <div style={styles.spinner}></div>
          <p style={{ marginTop: '15px', color: '#666' }}>正在生成中，请稍候...</p>
        </div>

        <div id="result"></div>
      </div>

      <script dangerouslySetInnerHTML={{ __html: script }} />
    </div>
  );
}

const styles = {
  container: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    minHeight: '100vh',
    padding: '20px',
  },
  title: {
    color: 'white',
    textAlign: 'center',
    marginBottom: '30px',
    fontSize: '2.5em',
    textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
  },
  card: {
    maxWidth: '800px',
    margin: '0 auto',
    background: 'white',
    borderRadius: '20px',
    padding: '30px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  settings: {
    background: '#f8f9fa',
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '20px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 600,
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    fontSize: '16px',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    fontSize: '16px',
    minHeight: '100px',
    resize: 'vertical',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    fontSize: '16px',
    boxSizing: 'border-box',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
  },
  button: {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '18px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  loading: {
    display: 'none',
    margin: '20px 0',
    textAlign: 'center',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto',
  },
};

const script = `
  async function generate() {
    const apiUrl = document.getElementById('apiUrl').value.trim();
    const apiKey = document.getElementById('apiKey').value.trim();
    const prompt = document.getElementById('prompt').value.trim();
    const size = document.getElementById('size').value;
    const style = document.getElementById('style').value;
    const resultDiv = document.getElementById('result');
    const loadingDiv = document.getElementById('loading');
    const btn = document.getElementById('generateBtn');

    if (!apiUrl || !apiKey) {
      resultDiv.innerHTML = '<div style="color:#e74c3c;background:#fdf2f2;padding:15px;border-radius:10px;margin-top:15px;">请先填写 API 地址和密钥</div>';
      return;
    }
    if (!prompt) {
      resultDiv.innerHTML = '<div style="color:#e74c3c;background:#fdf2f2;padding:15px;border-radius:10px;margin-top:15px;">请输入图像描述</div>';
      return;
    }

    localStorage.setItem('nano_api_url', apiUrl);
    localStorage.setItem('nano_api_key', apiKey);

    btn.disabled = true;
    loadingDiv.style.display = 'block';
    resultDiv.innerHTML = '';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + apiKey
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: prompt,
          n: 1,
          size: size,
          style: style,
          response_format: 'url'
        })
      });

      const data = await response.json();

      if (data.data && data.data[0]) {
        const imageUrl = data.data[0].url;
        const revisedPrompt = data.data[0].revised_prompt;
        
        resultDiv.innerHTML = '<div style="color:#27ae60;background:#f0fff4;padding:15px;border-radius:10px;margin-top:15px;">✅ 生成成功！</div>' +
          (revisedPrompt ? '<p style="margin:10px 0;color:#666;font-size:14px;">优化后的描述：' + revisedPrompt + '</p>' : '') +
          '<img src="' + imageUrl + '" style="max-width:100%;border-radius:15px;margin-top:15px;box-shadow:0 10px 40px rgba(0,0,0,0.2);" onclick="window.open(this.src)" style="cursor:pointer;" />' +
          '<p style="margin-top:10px;color:#666;font-size:14px;">点击图片查看原图</p>';
      } else if (data.error) {
        resultDiv.innerHTML = '<div style="color:#e74c3c;background:#fdf2f2;padding:15px;border-radius:10px;margin-top:15px;">❌ 错误：' + (data.error.message || JSON.stringify(data.error)) + '</div>';
      } else {
        resultDiv.innerHTML = '<div style="color:#e74c3c;background:#fdf2f2;padding:15px;border-radius:10px;margin-top:15px;">❌ 未知错误：' + JSON.stringify(data) + '</div>';
      }
    } catch (error) {
      resultDiv.innerHTML = '<div style="color:#e74c3c;background:#fdf2f2;padding:15px;border-radius:10px;margin-top:15px;">❌ 请求失败：' + error.message + '</div>';
    } finally {
      btn.disabled = false;
      loadingDiv.style.display = 'none';
    }
  }

  window.onload = function() {
    document.getElementById('apiUrl').value = localStorage.getItem('nano_api_url') || '';
    document.getElementById('apiKey').value = localStorage.getItem('nano_api_key') || '';
  };
`;
