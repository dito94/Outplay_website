import{c as e,s as t}from"./store.TKGHCdHD.js";import{t as n}from"./search.DqndXEzH.js";var r=JSON.parse(document.getElementById(`ci-data`)?.textContent||`{}`),i=r.s,a=r.lang,o=e=>n(String(e??``)),s=(e,t)=>e.replace(/\{(\w+)\}/g,(e,n)=>t[n]??``),c=e=>(e?.[a]||e?.bg||e?.en||``).trim(),l=(e=[])=>{let t=e.map(e=>(e[a]??``).trim()).filter(Boolean);return t.length?t:e.map(e=>(e.bg||e.en||``).trim()).filter(Boolean)},u=(e,t=20)=>`<svg width="${t}" height="${t}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${e}</svg>`,d={arrow:`<path d="M4 12h15"/><path d="m13 6 6 6-6 6"/>`,phone:`<path d="M5 4h3.2l1.6 4-2 1.3a10.5 10.5 0 0 0 4.9 4.9l1.3-2 4 1.6V17a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2Z"/>`,viber:`<path d="M12 2.8c5 0 8.4 2.4 8.4 7.9 0 5.2-3.2 7.8-8.2 7.8-.7 0-1.4 0-2-.1L7 21v-3.3c-2.4-1.2-3.4-3.6-3.4-7 0-5.5 3.4-7.9 8.4-7.9Z"/><path d="M9.3 7.3c.4-.3 1-.2 1.2.2l.7 1.3c.2.4.1.8-.2 1.1l-.4.3c.4 1 1.3 1.9 2.3 2.3l.3-.4c.3-.3.7-.4 1.1-.2l1.3.7c.4.2.5.8.2 1.2-.6.8-1.6 1.1-2.6.7a7.6 7.6 0 0 1-4.6-4.6c-.4-1 0-2 .7-2.6Z"/>`,expand:`<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>`,info:`<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8h.01"/>`},f=document.querySelector(`[data-ci-hero]`),p=document.querySelector(`[data-ci-body]`),m=document.querySelector(`[data-subnav]`),h=new URLSearchParams(location.search).get(`id`)??``,g=h?t(h):void 0,_=e=>`<nav class="ci-crumbs" aria-label="${o(i.crumbs)}"><ol>${e.map((t,n)=>t.href&&n<e.length-1?`<li><a href="${o(t.href)}">${o(t.label)}</a></li>`:`<li><span aria-current="page">${o(t.label)}</span></li>`).join(``)}</ol></nav>`;function v(e){if(e<=0)return[];if(e===1)return[[12,3]];if(e===2)return[[7,2],[5,2]];if(e===4)return[[7,2],[5,2],[5,2],[7,2]];let t=[[8,2],[4,1],[4,1]],n=e-3;for(;n>0;)n===1?(t.push([12,2]),--n):n===2||n===4?(t.push([6,2],[6,2]),n-=2):(t.push([4,2],[4,2],[4,2]),n-=3);return t}function y(){f.innerHTML=`<section class="section ci-missing" aria-labelledby="ci-title">
        <div class="wrap">
          ${_([{label:i.home,href:r.home},{label:i.products,href:r.products},{label:i.metaTitle}])}
          <div class="ci-missing-box">
            <h1 id="ci-title" class="h2 rule">${o(i.missingTitle)}</h1>
            <p class="lead">${o(i.missingText)}</p>
            <div class="btn-row">
              <a class="btn" href="${o(r.products)}">${o(i.allProducts)} ${u(d.arrow,18)}</a>
              <a class="btn btn-ghost" href="${o(r.admin)}">${o(i.admin)}</a>
            </div>
          </div>
        </div>
      </section>`,m&&(m.hidden=!0),document.querySelector(`[data-scta]`)?.setAttribute(`hidden`,``),document.title=`${i.missingTitle} · OUTPLAY`}function b(t){let n=c(t.name)||t.id,a=r.categories[t.category],h=c(t.tagline),g=c(t.summary),y=l((t.sections??[]).flatMap(e=>e.paragraphs??[])),b=l(t.features),x=(t.specs??[]).map(e=>({label:c(e.label),value:c(e.value)})).filter(e=>e.label||e.value),S=(t.images??[]).filter(e),C=S[0],w=y.length?S[1]:void 0,T=S.slice(w?2:1),E=r.phones[0];f.innerHTML=`<section class="ci-hero" aria-labelledby="ci-title">
        <div class="wrap">
          ${_([{label:i.home,href:r.home},{label:i.products,href:r.products},...a?[{label:a.name,href:a.href}]:[],{label:n}])}
          <div class="ci-top${C?``:` no-media`}">
            <div class="ci-titles">
              <h1 id="ci-title" class="ci-h1${n.length>14?` is-long`:``}">${o(n)}</h1>
              ${a?`<p class="ci-full">${o(a.name)}</p>`:``}
            </div>
            ${C?`<div class="ci-hero-media"><div class="media ci-hero-img"><img src="${o(C)}" alt="${o(n)}" /></div></div>`:``}
            <div class="ci-intro">
              ${h?`<p class="ci-tagline">${o(h)}</p>`:``}
              ${g?`<p class="lead ci-sum">${o(g)}</p>`:``}
              <div class="btn-row ci-ctas" data-sticky-cta-start>
                <a class="btn" href="#inquiry">${o(i.quote)} ${u(d.arrow,18)}</a>
                <a class="btn btn-viber ci-alt" href="${o(r.viber)}">${u(d.viber,18)} Viber</a>
                ${E?`<a class="ci-phone ci-alt num" href="tel:${o(E.e164)}">${u(d.phone,18)} ${o(E.display)}</a>`:``}
              </div>
            </div>
          </div>
          ${t.hidden?`<p class="ci-notice">${u(d.info,18)}<span>${o(i.hiddenNote)}</span></p>`:``}
        </div>
      </section>`;let D=[y.length&&`overview`,(b.length||x.length)&&`specs`,T.length&&`gallery`,`inquiry`].filter(Boolean),O=Object.fromEntries(D.map((e,t)=>[e,t%2?`mist`:``])),k=[];if(y.length){let e=`<div class="prose">${y.map(e=>`<p>${o(e)}</p>`).join(``)}</div>`;k.push(`<section id="overview" data-sn-section="overview" class="section ${O.overview}" aria-labelledby="ci-overview">
          <div class="wrap">${w?`<article class="ci-row"><div class="ci-row-text"><h2 id="ci-overview" class="h2 rule">${o(i.navOverview)}</h2>${e}</div>
                 <div class="ci-row-media media"><img src="${o(w)}" alt="${o(`${n}, ${i.photo} 2`)}" loading="lazy" /></div></article>`:`<article class="ci-solo"><h2 id="ci-overview" class="h2 rule">${o(i.navOverview)}</h2>${e}</article>`}</div>
        </section>`)}if((b.length||x.length)&&k.push(`<section id="specs" data-sn-section="specs" class="section ${O.specs}">
          <div class="wrap"><div class="ci-spec-grid${b.length&&x.length?``:` one`}">
            ${b.length?`<div class="ci-spec-col"><h2 class="h3 rule">${o(i.features)}</h2><ul class="ticks">${b.map(e=>`<li>${o(e)}</li>`).join(``)}</ul></div>`:``}
            ${x.length?`<div class="ci-spec-col"><h2 class="h3 rule" id="ci-specs-title">${o(i.specs)}</h2>
                   <table class="spec-table" aria-labelledby="ci-specs-title"><tbody>${x.map(e=>`<tr><th scope="row">${o(e.label)}</th><td>${o(e.value)}</td></tr>`).join(``)}</tbody></table>
                   <p class="ci-spec-note small muted">${o(i.specsNote)} ${o(i.noPrices)}</p></div>`:``}
          </div></div>
        </section>`),T.length){let e=v(T.length),t=T.length>1&&(T.length-1)%2==1,r=w?3:2;k.push(`<section id="gallery" data-sn-section="gallery" class="section ${O.gallery}" aria-labelledby="ci-gallery">
          <div class="wrap">
            <div class="ci-head"><h2 id="ci-gallery" class="h2 rule">${o(i.gallery)}</h2><p class="lead">${o(s(i.galleryIntro,{name:n}))}</p></div>
            <ul class="ci-pgal" role="list">${T.map((a,s)=>{let[c,l]=e[s],f=`${n}, ${i.photo} ${r+s}`;return`<li class="ci-tile${s===0||t&&s===T.length-1?` m-wide`:``}" style="--c:${c};--r:${l}">
                  <a class="ci-tile-link media" href="${o(a)}" data-lightbox="custom-product" data-caption="${o(f)}">
                    <img src="${o(a)}" alt="${o(f)}" loading="lazy" />
                    <span class="ci-zoom" aria-hidden="true">${u(d.expand,18)}</span><span class="sr-only">${o(i.open)}</span>
                  </a></li>`}).join(``)}</ul>
          </div>
        </section>`)}p.innerHTML=k.join(``);let A=document.querySelector(`[data-ci-inquiry]`);if(A){let e=A.querySelector(`[data-ci-inq-title]`);e&&(e.textContent=s(i.quoteTitle,{product:n})),O.inquiry&&A.classList.add(O.inquiry),A.hidden=!1}if(m){m.querySelectorAll(`[data-sn-link]`).forEach(e=>{document.getElementById(e.dataset.snLink??``)||e.closest(`li`)?.remove()});let e=m.querySelector(`.sn-title`);e&&(e.textContent=n)}let j=document.querySelector(`[data-ci-subnav]`);j&&(j.hidden=!1),document.title=`${n} · OUTPLAY`;let M=document.querySelector(`meta[name="description"]`);M&&(g||h)&&M.setAttribute(`content`,g||h)}g?b(g):y();