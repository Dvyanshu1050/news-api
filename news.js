 const NEWS_API_KEY = 'e1df7346e3e94ae3870c2450f9f2a7bf'; 
    const WEATHER_API_KEY = '952dbeec8f3d40538e4115239252803'; 

    
    const tabs = document.querySelectorAll('.tab');
    const navItems = document.querySelectorAll('.navItem');
    const feed = document.getElementById('feed');
    const trending = document.getElementById('trending');
    const heroTitle = document.getElementById('heroTitle');
    const heroSummary = document.getElementById('heroSummary');
    const heroCover = document.getElementById('heroCover');
    const countEl = document.getElementById('count');
    const weatherMini = document.getElementById('weatherMini');
    const weatherMore = document.getElementById('weatherMore');
    const offerList = document.getElementById('offerList');
    const offerCount = document.getElementById('offerCount');
    const cats = document.getElementById('cats');
    const offersMini = document.getElementById('offersMini');

    
    const demoOffers = [
      {title:'50% off - TechStore', code:'TECH50'},
      {title:'Free delivery ₹199+', code:'FREESHIP'},
      {title:'Coffee BOGO Weekend', code:'B1G1'}
    ];
    const categories = ['Top','India','World','Business','Tech','Sports','Entertainment','Lifestyle'];

    /
    function makeArticleCard(article) {
      const div = document.createElement('div');
      div.className = 'card';
      div.innerHTML = `
        <div class="thumb" style="background-image:url('${article.urlToImage || 'https://via.placeholder.com/400x300?text=No+Image'}')"></div>
        <div class="meta">
          <h3>${escapeHtml(article.title || 'Untitled')}</h3>
          <p class="small">${escapeHtml(article.description || '')}</p>
        </div>
      `;
      div.addEventListener('click', () => {
        if (article.url) window.open(article.url, '_blank');
      });
      return div;
    }

    function escapeHtml(s){
      return s ? s.replaceAll('<','&lt;').replaceAll('>','&gt;') : '';
    }

    
    function renderFeed(articles) {
      feed.innerHTML = '';
      trending.innerHTML = '';
      if (!articles.length) {
        feed.innerHTML = '<div class="small">No articles found</div>';
        countEl.textContent = '0 results';
        return;
      }
      
      const first = articles[0];
      heroTitle.textContent = first.title || 'Featured';
      heroSummary.textContent = first.description || '';
      heroCover.style.backgroundImage = `linear-gradient(180deg, rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url('${first.urlToImage || ''}')`;

      
      const top = articles.slice(0, 8);
      top.forEach(a => feed.appendChild(makeArticleCard(a)));

      
      const t = articles.slice(8, 14);
      t.forEach(a => trending.appendChild(makeArticleCard(a)));

   
      countEl.textContent = articles.length + ' results';

     
      offerList.innerHTML = demoOffers.map(o => `<div style="padding:8px 0">${o.title} • <strong>${o.code}</strong></div>`).join('');
      offerCount.textContent = demoOffers.length + ' offers';
      offersMini.innerHTML = demoOffers.map(o=>`<span style="display:inline-block;background:rgba(255,255,255,0.02);padding:6px 8px;border-radius:6px;margin-right:6px;font-size:12px">${o.title}</span>`).join('');
      cats.innerHTML = categories.map(c => `<div style="padding:6px 8px;border-radius:8px;background:rgba(255,255,255,0.02);margin-bottom:6px;display:inline-block">${c}</div>`).join('');
    }

    
    async function fetchNews(query, pageSize = 20) {
      try {
        const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=${pageSize}&apiKey=${NEWS_API_KEY}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('News API error ' + res.status);
        const json = await res.json();
        return json.articles || [];
      } catch (err) {
        console.error(err);
        return [];
      }
    }

    async function fetchTopHeadlinesCountry(country = 'in', language) {
      try {
        let url = `https://newsapi.org/v2/top-headlines?country=${country}&pageSize=20&apiKey=${NEWS_API_KEY}`;
        if (language) url += `&language=${language}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('News API error ' + res.status);
        const j = await res.json();
        return j.articles || [];
      } catch (e) {
        console.error(e);
        return [];
      }
    }

    async function fetchWeather(location = 'India') {
      try {
        const url = `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(location)}&aqi=yes`;
        const r = await fetch(url);
        if (!r.ok) throw new Error('Weather API ' + r.status);
        const j = await r.json();
        weatherMini.textContent = `${j.location?.name || location}: ${j.current?.temp_c ?? '--'}°C • ${j.current?.condition?.text ?? ''}`;
        weatherMore.textContent = `Humidity: ${j.current?.humidity ?? '-'} • Wind: ${j.current?.wind_kph ?? '-'} kph`;
      } catch (e) {
        console.error(e);
        weatherMini.textContent = 'Weather unavailable';
        weatherMore.textContent = '';
      }
    }

    
    function setActiveTab(name) {
      tabs.forEach(t => t.classList.toggle('active', t.getAttribute('data-tab') === name));
      navItems.forEach(n => n.classList.toggle('active', n.getAttribute('data-tab') === name));
     
      if (name === 'current') {
        
        fetchNews('latest news', 20).then(renderFeed);
      } else if (name === 'india') {
        fetchTopHeadlinesCountry('in').then(renderFeed);
      } else if (name === 'hindi') {
        
        fetchTopHeadlinesCountry('in', 'hi').then(renderFeed);
      } else if (name === 'weather') {
      
        fetchWeather('India');
        fetchNews('weather India', 20).then(renderFeed);
      }
    }

   
    tabs.forEach(t => t.addEventListener('click', () => setActiveTab(t.getAttribute('data-tab'))));
    navItems.forEach(n => n.addEventListener('click', () => setActiveTab(n.getAttribute('data-tab'))));

 
    document.getElementById('searchBtn').addEventListener('click', () => {
      const q = document.getElementById('q').value.trim();
      if (!q) return alert('Type a search term');
      fetchNews(q, 20).then(renderFeed);
      
      tabs.forEach(t => t.classList.remove('active'));
      navItems.forEach(n => n.classList.remove('active'));
    });
    document.getElementById('q').addEventListener('keydown', (e) => { if (e.key === 'Enter') document.getElementById('searchBtn').click(); });

    
    setActiveTab('current');
    
    fetchWeather();
