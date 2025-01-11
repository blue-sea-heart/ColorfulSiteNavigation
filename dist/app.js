"use strict";
let categories = JSON.parse(localStorage.getItem('categories') || '[]');
let isEditMode = false; // 编辑模式开关
// 生成近似颜色的函数
function generateColor(baseColor) {
    const color = baseColor.substring(1); // 去掉 # 号
    return `#${(parseInt(color, 16) + 100000).toString(16)}`;
}
// 切换编辑模式的函数
function toggleEditMode() {
    isEditMode = !isEditMode;
    document.body.classList.toggle('edit-mode', isEditMode);
    updateLinks(); // 切换编辑模式时刷新页面
}
// 添加网址的函数
function addLink() {
    const title = document.getElementById("link-title").value;
    const url = document.getElementById("link-url").value;
    const category = document.getElementById("link-category").value;
    const subcategory = document.getElementById("link-subcategory").value;
    if (title && url && category && subcategory) {
        // 找到一级分类
        let categoryObj = categories.find(c => c.name === category);
        if (!categoryObj) {
            categoryObj = { name: category, subcategories: [] };
            categories.push(categoryObj);
        }
        // 找到二级分类
        let subcategoryObj = categoryObj.subcategories.find(s => s.name === subcategory);
        if (!subcategoryObj) {
            const randomColor = generateColor("#ff6347"); // 使用一级分类颜色生成二级分类颜色
            subcategoryObj = { name: subcategory, color: randomColor, links: [] };
            categoryObj.subcategories.push(subcategoryObj);
        }
        const newLink = { title, url, frequency: 0 };
        subcategoryObj.links.push(newLink);
        localStorage.setItem('categories', JSON.stringify(categories));
        updateLinks(); // 刷新页面
    }
    closeAddLinkForm();
}
// 更新网址列表
function updateLinks() {
    const linkList = document.getElementById("link-list");
    linkList.innerHTML = "";
    categories.forEach(category => {
        category.subcategories.forEach(subcategory => {
            const subcategoryCard = document.createElement("div");
            subcategoryCard.style.backgroundColor = subcategory.color;
            subcategoryCard.classList.add("link-card");
            if (isEditMode) {
                subcategoryCard.setAttribute('draggable', 'true');
                subcategoryCard.addEventListener('dragstart', (event) => dragStart(event, category.name, subcategory.name));
            }
            subcategory.links.forEach(link => {
                const linkElement = document.createElement("a");
                linkElement.href = link.url;
                linkElement.textContent = link.title;
                subcategoryCard.appendChild(linkElement);
            });
            linkList.appendChild(subcategoryCard);
        });
    });
}
// 拖拽事件处理
function dragStart(event, categoryName, subcategoryName) {
    var _a;
    const dragData = { categoryName, subcategoryName };
    (_a = event.dataTransfer) === null || _a === void 0 ? void 0 : _a.setData("text/plain", JSON.stringify(dragData));
}
// 拖拽结束后更新排序
function dropCategory(event, categoryName) {
    var _a;
    const draggedData = JSON.parse(((_a = event.dataTransfer) === null || _a === void 0 ? void 0 : _a.getData("text/plain")) || '{}');
    // 根据需要更新分类顺序，保存到 localStorage
}
// 关闭添加网址表单
function closeAddLinkForm() {
    document.getElementById("add-link-form").style.display = "none";
}
// 显示添加网址表单
function showAddLinkForm() {
    document.getElementById("add-link-form").style.display = "block";
}
