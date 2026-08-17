(() => {
  'use strict';

  const D = window.OceanData;
  const Store = window.OceanStore;
  if (!D || !Store) return;

  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const currentTotal = () => Object.values(Store.get().xp || {}).reduce((n, v) => n + Number(v || 0), 0);
  const safeTotal = () => Object.values(Store.get().xpVault || {}).reduce((n, v) => n + Number(v || 0), 0);

  function toast(msg) {
    const old = document.querySelector('.xp-recovery-toast');
    if (old) old.remove();
    const el = document.createElement('div');
    el.className = 'xp-recovery-toast';
    el.textContent = msg;
    document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.add('show'));
    setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 220); }, 1800);
  }

  function stageImage(c, xp) {
    const info = D.levelInfo(Number(xp || 0));
    return c.stages?.[info.visualStage] || c.adult || '';
  }

  function sectionHTML() {
    const s = Store.get();
    return `
      <h3>🛟 XPの保護と復元</h3>
      <p>育てた相棒が消えても戻せます。最高XPは自動で保護し、必要なら保護者が手動でXPを設定できます。</p>
      <div class="xp-vault-stats">
        <div><span>現在のXP合計</span><b>${currentTotal()}</b></div>
        <div><span>保護XP合計</span><b>${safeTotal()}</b></div>
      </div>
      <div class="xp-vault-actions">
        <button type="button" data-xp-action="protect">🪄 今のXPを保護</button>
        <button type="button" data-xp-action="restore-all">♻️ 保護XPへ戻す</button>
      </div>
      <div class="xp-recovery-list">
        ${D.CREATURES.map(c => {
          const cur = Number(s.xp?.[c.id] || 0);
          const safe = Number(s.xpVault?.[c.id] || 0);
          return `<div class="xp-recovery-row">
            <img src="${stageImage(c, cur)}" alt="${esc(c.short)}">
            <div class="xp-recovery-meta"><b>${esc(c.short)}</b><small>現在 ${cur} XP ／ 保護 ${safe} XP</small></div>
            <input id="xp-recover-${c.id}" type="number" inputmode="numeric" min="0" max="999999" step="10" value="${Math.max(cur, safe)}" aria-label="${esc(c.short)}の復元XP">
            <button type="button" data-xp-action="restore-one" data-id="${c.id}">復元</button>
          </div>`;
        }).join('')}
      </div>
      <small class="xp-help">※「復元」は入力したXPに戻します。復元したXPも自動で保護されます。</small>`;
  }

  function ensureStyle() {
    if (document.getElementById('xp-recovery-style')) return;
    const style = document.createElement('style');
    style.id = 'xp-recovery-style';
    style.textContent = `
      .xp-recovery-card{margin-top:12px}
      .xp-vault-stats{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:10px 0}
      .xp-vault-stats>div{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:14px;padding:10px;text-align:center}
      .xp-vault-stats span{display:block;font-size:9px;color:var(--muted,#9fb0c4)}
      .xp-vault-stats b{display:block;font-size:20px;margin-top:4px}
      .xp-vault-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px}
      .xp-vault-actions button,.xp-recovery-row button{border:1px solid rgba(255,255,255,.12);background:rgba(78,186,255,.12);color:#fff;border-radius:12px;min-height:40px;font-weight:800;font-size:9px}
      .xp-recovery-list{display:grid;gap:7px;margin-top:12px}
      .xp-recovery-row{display:grid;grid-template-columns:42px minmax(0,1fr) 78px 54px;gap:6px;align-items:center;padding:7px;background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.08);border-radius:13px}
      .xp-recovery-row img{width:42px;height:42px;object-fit:contain;border-radius:9px;background:rgba(0,0,0,.13)}
      .xp-recovery-meta{min-width:0}.xp-recovery-meta b{display:block;font-size:10px}.xp-recovery-meta small{display:block;font-size:7px;color:var(--muted,#9fb0c4);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .xp-recovery-row input{width:100%;min-width:0;padding:8px 4px;border-radius:9px;border:1px solid rgba(255,255,255,.12);background:#071b31;color:#fff;text-align:right;font-weight:800}
      .xp-help{display:block;margin-top:8px;font-size:8px;color:var(--muted,#9fb0c4)}
      .xp-recovery-toast{position:fixed;left:50%;top:calc(20px + env(safe-area-inset-top));transform:translate(-50%,-12px);opacity:0;z-index:9999;padding:10px 16px;border-radius:22px;background:#073454;color:#fff;border:1px solid rgba(101,210,255,.4);font-size:11px;font-weight:800;transition:.2s;box-shadow:0 8px 30px rgba(0,0,0,.3)}
      .xp-recovery-toast.show{opacity:1;transform:translate(-50%,0)}
      @media(max-width:390px){.xp-recovery-row{grid-template-columns:38px minmax(0,1fr) 68px 50px;gap:5px}.xp-recovery-row img{width:38px;height:38px}}
    `;
    document.head.appendChild(style);
  }

  function inject() {
    ensureStyle();
    const page = document.querySelector('.settings-page');
    if (!page) return;
    let card = page.querySelector('.xp-recovery-card');
    if (!card) {
      card = document.createElement('section');
      card.className = 'glass settings-card xp-recovery-card';
      const danger = page.querySelector('.danger-zone');
      if (danger) page.insertBefore(card, danger);
      else page.appendChild(card);
    }
    const sig = JSON.stringify({xp:Store.get().xp||{},vault:Store.get().xpVault||{}});
    if (card.dataset.xpSignature !== sig) {
      card.dataset.xpSignature = sig;
      card.innerHTML = sectionHTML();
    }
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-xp-action]');
    if (!btn) return;
    const action = btn.dataset.xpAction;
    if (action === 'protect') {
      Store.saveXpVault();
      toast('今のXPを保護しました');
      inject();
    } else if (action === 'restore-all') {
      if (!confirm('保護された最高XPまで全キャラクターを戻しますか？')) return;
      Store.restoreXpFromVault();
      toast('保護XPを復元しました');
      inject();
    } else if (action === 'restore-one') {
      const id = btn.dataset.id;
      const c = D.CREATURES.find(x => x.id === id);
      const input = document.getElementById(`xp-recover-${id}`);
      const val = Math.max(0, Math.min(999999, Math.floor(Number(input?.value) || 0)));
      if (!c || !confirm(`${c.short}を ${val} XP に復元しますか？`)) return;
      Store.restoreOneXp(id, val);
      toast(`${c.short}を ${val} XP に復元しました`);
      inject();
    }
  });

  const observer = new MutationObserver(() => inject());
  observer.observe(document.getElementById('app') || document.body, {childList:true, subtree:true});
  window.addEventListener('ocean:state', () => inject());
  inject();
})();
