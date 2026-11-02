import{s as e}from"./store.DuKnfLF1.js";var t=JSON.parse(document.getElementById(`ci-data`)?.textContent||`{}`),n=t.s,r=t.lang,i={"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`},a=e=>String(e??``).replace(/[&<>"']/g,e=>i[e]),o=(e,t)=>e.replace(/\{(\w+)\}/g,(e,n)=>t[n]??``),s=e=>(e?.[r]||e?.bg||e?.en||``).trim(),c=(e=[])=>{let t=e.map(e=>(e[r]??``).trim()).filter(Boolean);return t.length?t:e.map(e=>(e.bg||e.en||``).trim()).filter(Boolean)},l=(e,t=20)=>`<svg width="${t}" height="${t}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${e}</svg>`,u={arrow:`<path d="M4 12h15"/><path d="m13 6 6 6-6 6"/>`,phone:`<path d="M5 4h3.2l1.6 4-2 1.3a10.5 10.5 0 0 0 4.9 4.9l1.3-2 4 1.6V17a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2Z"/>`,viber:`<path d="M12 2.8c5 0 8.4 2.4 8.4 7.9 0 5.2-3.2 7.8-8.2 7.8-.7 0-1.4 0-2-.1L7 21v-3.3c-2.4-1.2-3.4-3.6-3.4-7 0-5.5 3.4-7.9 8.4-7.9Z"/><path d="M9.3 7.3c.4-.3 1-.2 1.2.2l.7 1.3c.2.4.1.8-.2 1.1l-.4.3c.4 1 1.3 1.9 2.3 2.3l.3-.4c.3-.3.7-.4 1.1-.2l1.3.7c.4.2.5.8.2 1.2-.6.8-1.6 1.1-2.6.7a7.6 7.6 0 0 1-4.6-4.6c-.4-1 0-2 .7-2.6Z"/>`,expand:`<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>`,info:`<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8h.01"/>`},d=document.querySelector(`[data-ci-hero]`),f=document.querySelector(`[data-ci-body]`),p=document.querySelector(`[data-subnav]`),m=new URLSearchParams(location.search).get(`id`)??``,h=m?e(m):void 0,g=e=>`<nav class="ci-crumbs" aria-label="${a(n.crumbs)}"><ol>${e.map((t,n)=>t.href&&n<e.length-1?`<li><a href="${a(t.href)}">${a(t.label)}</a></li>`:`<li><span aria-current="page">${a(t.label)}</span></li>`).join(``)}</ol></nav>`;function _(e){if(e<=0)return[];if(e===1)return[[12,3]];if(e===2)return[[7,2],[5,2]];if(e===4)return[[7,2],[5,2],[5,2],[7,2]];let t=[[8,2],[4,1],[4,1]],n=e-3;for(;n>0;)n===1?(t.push([12,2]),--n):n===2||n===4?(t.push([6,2],[6,2]),n-=2):(t.push([4,2],[4,2],[4,2]),n-=3);return t}function v(){d.innerHTML=`<section class="section ci-missing" aria-labelledby="ci-title">
        <div class="wrap">
          ${g([{label:n.home,href:t.home},{label:n.products,href:t.products},{label:n.metaTitle}])}
          <div class="ci-missing-box">
            <h1 id="ci-title" class="h2 rule">${a(n.missingTitle)}</h1>
            <p class="lead">${a(n.missingText)}</p>
            <div class="btn-row">
              <a class="btn" href="${a(t.products)}">${a(n.allProducts)} ${l(u.arrow,18)}</a>
              <a class="btn btn-ghost" href="${a(t.admin)}">${a(n.admin)}</a>
            </div>
          </div>
        </div>
      </section>`,p&&(p.hidden=!0),document.querySelector(`[data-scta]`)?.setAttribute(`hidden`,``),document.title=`${n.missingTitle} · OUTPLAY`}function y(e){let r=s(e.name)||e.id,i=t.categories[e.category],m=s(e.tagline),h=s(e.summary),v=c((e.sections??[]).flatMap(e=>e.paragraphs??[])),y=c(e.features),b=(e.specs??[]).map(e=>({label:s(e.label),value:s(e.value)})).filter(e=>e.label||e.value),x=(e.images??[]).filter(e=>typeof e==`string`&&e.startsWith(`data:image/`)),S=x[0],C=v.length?x[1]:void 0,w=x.slice(C?2:1),T=t.phones[0];d.innerHTML=`<section class="ci-hero" aria-labelledby="ci-title">
        <div class="wrap">
          ${g([{label:n.home,href:t.home},{label:n.products,href:t.products},...i?[{label:i.name,href:i.href}]:[],{label:r}])}
          <div class="ci-top${S?``:` no-media`}">
            <div class="ci-titles">
              <h1 id="ci-title" class="ci-h1${r.length>14?` is-long`:``}">${a(r)}</h1>
              ${i?`<p class="ci-full">${a(i.name)}</p>`:``}
            </div>
            ${S?`<div class="ci-hero-media"><div class="media ci-hero-img"><img src="${S}" alt="${a(r)}" /></div></div>`:``}
            <div class="ci-intro">
              ${m?`<p class="ci-tagline">${a(m)}</p>`:``}
              ${h?`<p class="lead ci-sum">${a(h)}</p>`:``}
              <div class="btn-row ci-ctas" data-sticky-cta-start>
                <a class="btn" href="#inquiry">${a(n.quote)} ${l(u.arrow,18)}</a>
                <a class="btn btn-viber ci-alt" href="${a(t.viber)}">${l(u.viber,18)} Viber</a>
                ${T?`<a class="ci-phone ci-alt num" href="tel:${a(T.e164)}">${l(u.phone,18)} ${a(T.display)}</a>`:``}
              </div>
            </div>
          </div>
          ${e.hidden?`<p class="ci-notice">${l(u.info,18)}<span>${a(n.hiddenNote)}</span></p>`:``}
        </div>
      </section>`;let E=[v.length&&`overview`,(y.length||b.length)&&`specs`,w.length&&`gallery`,`inquiry`].filter(Boolean),D=Object.fromEntries(E.map((e,t)=>[e,t%2?`mist`:``])),O=[];if(v.length){let e=`<div class="prose">${v.map(e=>`<p>${a(e)}</p>`).join(``)}</div>`;O.push(`<section id="overview" data-sn-section="overview" class="section ${D.overview}" aria-labelledby="ci-overview">
          <div class="wrap">${C?`<article class="ci-row"><div class="ci-row-text"><h2 id="ci-overview" class="h2 rule">${a(n.navOverview)}</h2>${e}</div>
                 <div class="ci-row-media media"><img src="${C}" alt="${a(`${r}, ${n.photo} 2`)}" loading="lazy" /></div></article>`:`<article class="ci-solo"><h2 id="ci-overview" class="h2 rule">${a(n.navOverview)}</h2>${e}</article>`}</div>
        </section>`)}if((y.length||b.length)&&O.push(`<section id="specs" data-sn-section="specs" class="section ${D.specs}">
          <div class="wrap"><div class="ci-spec-grid${y.length&&b.length?``:` one`}">
            ${y.length?`<div class="ci-spec-col"><h2 class="h3 rule">${a(n.features)}</h2><ul class="ticks">${y.map(e=>`<li>${a(e)}</li>`).join(``)}</ul></div>`:``}
            ${b.length?`<div class="ci-spec-col"><h2 class="h3 rule" id="ci-specs-title">${a(n.specs)}</h2>
                   <table class="spec-table" aria-labelledby="ci-specs-title"><tbody>${b.map(e=>`<tr><th scope="row">${a(e.label)}</th><td>${a(e.value)}</td></tr>`).join(``)}</tbody></table>
                   <p class="ci-spec-note small muted">${a(n.specsNote)} ${a(n.noPrices)}</p></div>`:``}
          </div></div>
        </section>`),w.length){let e=_(w.length),t=w.length>1&&(w.length-1)%2==1,i=C?3:2;O.push(`<section id="gallery" data-sn-section="gallery" class="section ${D.gallery}" aria-labelledby="ci-gallery">
          <div class="wrap">
            <div class="ci-head"><h2 id="ci-gallery" class="h2 rule">${a(n.gallery)}</h2><p class="lead">${a(o(n.galleryIntro,{name:r}))}</p></div>
            <ul class="ci-pgal" role="list">${w.map((o,s)=>{let[c,d]=e[s],f=`${r}, ${n.photo} ${i+s}`;return`<li class="ci-tile${s===0||t&&s===w.length-1?` m-wide`:``}" style="--c:${c};--r:${d}">
                  <a class="ci-tile-link media" href="${o}" data-lightbox="custom-product" data-caption="${a(f)}">
                    <img src="${o}" alt="${a(f)}" loading="lazy" />
                    <span class="ci-zoom" aria-hidden="true">${l(u.expand,18)}</span><span class="sr-only">${a(n.open)}</span>
                  </a></li>`}).join(``)}</ul>
          </div>
        </section>`)}f.innerHTML=O.join(``);let k=document.querySelector(`[data-ci-inquiry]`);if(k){let e=k.querySelector(`[data-ci-inq-title]`);e&&(e.textContent=o(n.quoteTitle,{product:r})),D.inquiry&&k.classList.add(D.inquiry),k.hidden=!1}if(p){p.querySelectorAll(`[data-sn-link]`).forEach(e=>{document.getElementById(e.dataset.snLink??``)||e.closest(`li`)?.remove()});let e=p.querySelector(`.sn-title`);e&&(e.textContent=r)}document.title=`${r} · OUTPLAY`;let A=document.querySelector(`meta[name="description"]`);A&&(h||m)&&A.setAttribute(`content`,h||m)}h?y(h):v();