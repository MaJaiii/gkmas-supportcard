let cards = [];

// データ読み込み
fetch("cards.json")
    .then(res => res.json())
    .then(data => {
        cards = data;
        applyFilters();
    });

// フィルター処理
function applyFilters() {
    const colorFilters = Array.from(document.querySelectorAll(".color:checked")).map(cb => cb.value);
    const rarityFilters = Array.from(document.querySelectorAll(".rarity:checked")).map(cb => cb.value);
    const traitFilters = Array.from(document.querySelectorAll(".trait:checked")).map(cb => cb.value);
    const tagFilters = Array.from(document.querySelectorAll(".effect-tag:checked")).map(cb => cb.value);

    let filtered = cards;

    if (colorFilters.length > 0) {
        filtered = filtered.filter(c => colorFilters.includes(c.color));
    }
    if (rarityFilters.length > 0) {
        filtered = filtered.filter(c => rarityFilters.includes(c.rarity));
    }
    if (traitFilters.length > 0) {
        filtered = filtered.filter(c => traitFilters.includes(c.trait));
    }
    if (tagFilters.length > 0) {
        filtered = filtered.filter(c => {
            const allEffects = [
                ...c.mainEffects,
                ...c.subEffects
            ];
            return tagFilters.every(tag =>
                allEffects.some(e => e.tags.includes(tag))
            );
        });
    }

    render(filtered);
}

// カード描画
function render(list) {
    const container = document.getElementById("results");
    if (list.length === 0) {
        container.innerHTML = "<p>カードが見つかりませんでした。</p>";
        return;
    }

    container.innerHTML = list.map(c => `
    <div class="card">
      <div class="title">${c.name}</div>
      <div class="sub">
        色：${c.color} | レアリティ：${c.rarity} | レベル：${c.level} | 特性：${c.trait}
      </div>

      <div><strong>メイン効果:</strong>
        <ul>
          ${c.mainEffects.map(e => `<li>${e.text}</li>`).join("")}
        </ul>
      </div>

      <div><strong>サブ効果:</strong>
        <ul>
          ${c.subEffects.map(e => `<li>${e.text}</li>`).join("")}
        </ul>
      </div>

      ${c.image ? `<img src="${c.image}" alt="${c.name}" class="card-img">` : ""}
    </div>
  `).join("");

    // 拡大画像
    document.querySelectorAll(".card-img").forEach(img => {
        img.addEventListener("click", () => {
            document.getElementById("modalImage").src = img.src;
            document.getElementById("imageModal").style.display = "flex";
        });
    });
}

// モーダル閉じる
document.getElementById("imageModal").addEventListener("click", () => {
    document.getElementById("imageModal").style.display = "none";
});

// フィルター変更イベント
document.querySelectorAll("input[type=checkbox]").forEach(cb => {
    cb.addEventListener("change", applyFilters);
});
