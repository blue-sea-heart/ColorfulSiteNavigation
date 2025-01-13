"use strict";
let categories = JSON.parse(localStorage.getItem('categories') || '[]');
let isEditMode = false; // 编辑模式开关
// 生成近似颜色的函数
function generateColor(baseColor) {
    const color = baseColor.substring(1); // 去掉 # 号
    return `#${(parseInt(color, 16) + 100000).toString(16)}`;
}
// 更新模式显示的函数
function updateModeDisplay() {
    const modeDisplay = document.getElementById("mode-display");
    if (modeDisplay) {
        modeDisplay.textContent = isEditMode ? "编辑模式" : "浏览模式";
    }
}
function toggleEditMode() {
    isEditMode = !isEditMode;
    document.body.classList.toggle('edit-mode', isEditMode);
    updateLinks(); // 切换编辑模式时刷新页面
    updateModeDisplay(); // 更新模式显示
    // 根据编辑模式显示或隐藏按钮
    const addCategoryBtn = document.getElementById("add-category-btn");
    if (addCategoryBtn) {
        addCategoryBtn.style.display = isEditMode ? 'block' : 'none';
    }
}
// 添加网址的函数
function addLink() {
    if (!isEditMode) {
        alert("请先切换到编辑模式！");
        return;
    }
    const title = document.getElementById("link-title").value;
    const url = document.getElementById("link-url").value;
    const category = document.getElementById("link-category-display").textContent;
    const subcategory = document.getElementById("link-subcategory-display").textContent;
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
        closeAddLinkForm(); // 自动关闭表单
    }
}
// 更新网址列表
function updateLinks() {
    const linkList = document.getElementById("link-list");
    linkList.innerHTML = "";
    categories.forEach(category => {
        const categoryHeader = document.createElement("div");
        categoryHeader.textContent = `一级分类: ${category.name}`;
        categoryHeader.style.fontWeight = "bold";
        categoryHeader.style.marginTop = "10px";
        linkList.appendChild(categoryHeader);
        category.subcategories.forEach(subcategory => {
            const subcategoryCard = document.createElement("div");
            subcategoryCard.style.backgroundColor = subcategory.color;
            subcategoryCard.classList.add("link-card");
            if (isEditMode) {
                subcategoryCard.setAttribute('draggable', 'true');
                subcategoryCard.addEventListener('dragstart', (event) => dragStart(event, category.name, subcategory.name));
            }
            const subcategoryHeader = document.createElement("div");
            subcategoryHeader.textContent = `二级分类: ${subcategory.name}`;
            subcategoryHeader.style.fontWeight = "bold";
            subcategoryCard.appendChild(subcategoryHeader);
            subcategory.links.forEach(link => {
                const linkElement = document.createElement("a");
                linkElement.href = link.url;
                linkElement.textContent = link.title;
                subcategoryCard.appendChild(linkElement);
                // 添加删除网址按钮
                if (isEditMode) {
                    const deleteLinkBtn = document.createElement("button");
                    deleteLinkBtn.textContent = "删除";
                    deleteLinkBtn.onclick = () => confirmDeleteLink(category.name, subcategory.name, link.title);
                    subcategoryCard.appendChild(deleteLinkBtn);
                }
            });
            if (isEditMode) {
                const addLinkBtn = document.createElement("button");
                addLinkBtn.textContent = "添加网址";
                addLinkBtn.onclick = () => showAddLinkForm(category.name, subcategory.name);
                subcategoryCard.appendChild(addLinkBtn);
                // 添加删除二级分类按钮
                const deleteSubcategoryBtn = document.createElement("button");
                deleteSubcategoryBtn.textContent = "删除";
                deleteSubcategoryBtn.onclick = () => confirmDeleteSubcategory(category.name, subcategory.name);
                subcategoryCard.appendChild(deleteSubcategoryBtn);
            }
            linkList.appendChild(subcategoryCard);
        });
        if (isEditMode) {
            const addSubcategoryBtn = document.createElement("button");
            addSubcategoryBtn.textContent = "添加二级分类";
            addSubcategoryBtn.onclick = () => showAddSubcategoryForm(category.name);
            linkList.appendChild(addSubcategoryBtn);
            // 添加删除一级分类按钮
            const deleteCategoryBtn = document.createElement("button");
            deleteCategoryBtn.textContent = "删除";
            deleteCategoryBtn.onclick = () => confirmDeleteCategory(category.name);
            linkList.appendChild(deleteCategoryBtn);
        }
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
function showAddLinkForm(categoryName, subcategoryName) {
    const addLinkForm = document.getElementById("add-link-form");
    addLinkForm.style.display = "block";
    document.getElementById("link-category-display").textContent = categoryName;
    document.getElementById("link-subcategory-display").textContent = subcategoryName;
    document.getElementById("link-title").value = "";
    document.getElementById("link-url").value = "";
}
// 关闭添加一级分类表单
function closeAddCategoryForm() {
    document.getElementById("add-category-form").style.display = "none";
}
// 显示添加一级分类表单
function showAddCategoryForm() {
    const addCategoryForm = document.getElementById("add-category-form");
    addCategoryForm.style.display = "block";
}
// 添加一级分类的函数
function addCategory() {
    if (!isEditMode) {
        alert("请先切换到编辑模式！");
        return;
    }
    const categoryName = document.getElementById("category-name").value;
    if (categoryName) {
        // 检查一级分类是否已存在
        if (categories.some(c => c.name === categoryName)) {
            alert("该一级分类名称已存在，请使用其他名称！");
            return;
        }
        const categoryObj = { name: categoryName, subcategories: [] };
        categories.push(categoryObj);
        localStorage.setItem('categories', JSON.stringify(categories));
        updateLinks(); // 刷新页面
        closeAddCategoryForm(); // 自动关闭表单
    }
}
// 关闭添加二级分类表单
function closeAddSubcategoryForm() {
    document.getElementById("add-subcategory-form").style.display = "none";
}
// 显示添加二级分类表单
function showAddSubcategoryForm(categoryName) {
    const addSubcategoryForm = document.getElementById("add-subcategory-form");
    addSubcategoryForm.style.display = "block";
    document.getElementById("subcategory-category-display").textContent = categoryName;
}
// 添加二级分类的函数
function addSubcategory() {
    if (!isEditMode) {
        alert("请先切换到编辑模式！");
        return;
    }
    const categoryName = document.getElementById("subcategory-category-display").textContent;
    const subcategoryName = document.getElementById("subcategory-name").value;
    if (categoryName && subcategoryName) {
        const categoryObj = categories.find(c => c.name === categoryName);
        if (categoryObj) {
            // 检查二级分类是否已存在
            if (categoryObj.subcategories.some(s => s.name === subcategoryName)) {
                alert("该二级分类名称在当前一级分类下已存在，请使用其他名称！");
                return;
            }
            const randomColor = generateColor("#ff6347"); // 使用一级分类颜色生成二级分类颜色
            const subcategoryObj = { name: subcategoryName, color: randomColor, links: [] };
            categoryObj.subcategories.push(subcategoryObj);
            localStorage.setItem('categories', JSON.stringify(categories));
            updateLinks(); // 刷新页面
            closeAddSubcategoryForm(); // 自动关闭表单
        }
    }
}
// 删除网址的函数
function deleteLink(categoryName, subcategoryName, linkTitle) {
    const category = categories.find(c => c.name === categoryName);
    if (category) {
        const subcategory = category.subcategories.find(s => s.name === subcategoryName);
        if (subcategory) {
            subcategory.links = subcategory.links.filter(link => link.title !== linkTitle);
            localStorage.setItem('categories', JSON.stringify(categories));
            updateLinks(); // 刷新页面
        }
    }
}
// 删除二级分类的函数
function deleteSubcategory(categoryName, subcategoryName) {
    const category = categories.find(c => c.name === categoryName);
    if (category) {
        category.subcategories = category.subcategories.filter(subcategory => subcategory.name !== subcategoryName);
        localStorage.setItem('categories', JSON.stringify(categories));
        updateLinks(); // 刷新页面
    }
}
// 删除一级分类的函数
function deleteCategory(categoryName) {
    categories = categories.filter(category => category.name !== categoryName);
    localStorage.setItem('categories', JSON.stringify(categories));
    updateLinks(); // 刷新页面
}
// 确认删除网址的函数
function confirmDeleteLink(categoryName, subcategoryName, linkTitle) {
    if (confirm(`确定要删除网址 "${linkTitle}" 吗？`)) {
        deleteLink(categoryName, subcategoryName, linkTitle);
    }
}
// 确认删除二级分类的函数
function confirmDeleteSubcategory(categoryName, subcategoryName) {
    if (confirm(`确定要删除二级分类 "${subcategoryName}" 及其所有网址吗？`)) {
        deleteSubcategory(categoryName, subcategoryName);
    }
}
// 确认删除一级分类的函数
function confirmDeleteCategory(categoryName) {
    if (confirm(`确定要删除一级分类 "${categoryName}" 及其所有二级分类和网址吗？`)) {
        deleteCategory(categoryName);
    }
}
// 初始化函数
function initialize() {
    updateLinks();
}
// 页面加载时调用初始化函数
window.onload = initialize;
