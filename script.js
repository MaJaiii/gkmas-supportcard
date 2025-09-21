let cards = [];

// �f�[�^�ǂݍ���
fetch("cards.json")
    .then(res => res.json())
    .then(data => {
        cards = data;
        applyFilters();
    });

// �t�B���^�[����
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

// �J�[�h�`��
function render(list) {
    const container = document.getElementById("results");
    if (list.length === 0) {
        container.innerHTML = "<p>�J�[�h��������܂���ł����B</p>";
        return;
    }

    container.innerHTML = list.map(c => `
    <div class="card">
      <div class="title">${c.name}</div>
      <div class="sub">
        �F�F${c.color} | ���A���e�B�F${c.rarity} | ���x���F${c.level} | �����F${c.trait}
      </div>

      <div><strong>���C������:</strong>
        <ul>
          ${c.mainEffects.map(e => `<li>${e.text}</li>`).join("")}
        </ul>
      </div>

      <div><strong>�T�u����:</strong>
        <ul>
          ${c.subEffects.map(e => `<li>${e.text}</li>`).join("")}
        </ul>
      </div>

      ${c.image ? `<img src="${c.image}" alt="${c.name}" class="card-img">` : ""}
    </div>
  `).join("");

    // �g��摜
    document.querySelectorAll(".card-img").forEach(img => {
        img.addEventListener("click", () => {
            document.getElementById("modalImage").src = img.src;
            document.getElementById("imageModal").style.display = "flex";
        });
    });
}

// ���[�_������
document.getElementById("imageModal").addEventListener("click", () => {
    document.getElementById("imageModal").style.display = "none";
});

// �t�B���^�[�ύX�C�x���g
document.querySelectorAll("input[type=checkbox]").forEach(cb => {
    cb.addEventListener("change", applyFilters);
});
