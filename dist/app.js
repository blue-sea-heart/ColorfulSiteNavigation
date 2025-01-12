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
    const addLinkBtn = document.getElementById("add-link-btn");
    if (addLinkBtn) {
        addLinkBtn.style.display = isEditMode ? 'block' : 'none';
    }
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
            if (isEditMode) {
                const addLinkBtn = document.createElement("button");
                addLinkBtn.textContent = "添加网址";
                addLinkBtn.onclick = () => showAddLinkForm(category.name, subcategory.name);
                subcategoryCard.appendChild(addLinkBtn);
            }
            linkList.appendChild(subcategoryCard);
        });
        if (isEditMode) {
            const addSubcategoryBtn = document.createElement("button");
            addSubcategoryBtn.textContent = "添加二级分类";
            addSubcategoryBtn.onclick = () => showAddSubcategoryForm(category.name);
            linkList.appendChild(addSubcategoryBtn);
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
    document.getElementById("link-category").value = categoryName;
    document.getElementById("link-category").disabled = true; // 禁用一级分类输入框
    document.getElementById("link-subcategory").value = subcategoryName;
    document.getElementById("link-subcategory").disabled = true; // 禁用二级分类输入框
    document.getElementById("link-title").value = "";
    document.getElementById("link-url").value = "";
}
// 关闭添加一级分类表单
function closeAddCategoryForm() {
    document.getElementById("add-category-form").style.display = "none";
}
// 显示添加一级分类表单
function showAddCategoryForm() {
    document.getElementById("add-category-form").style.display = "block";
}
// 添加一级分类的函数
function addCategory() {
    if (!isEditMode) {
        alert("请先切换到编辑模式！");
        return;
    }
    const categoryName = document.getElementById("category-name").value;
    if (categoryName) {
        const categoryObj = { name: categoryName, subcategories: [] };
        categories.push(categoryObj);
        localStorage.setItem('categories', JSON.stringify(categories));
        updateCategorySelector();
        closeAddCategoryForm();
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
    document.getElementById("subcategory-category").value = categoryName;
}
// 添加二级分类的函数
function addSubcategory() {
    if (!isEditMode) {
        alert("请先切换到编辑模式！");
        return;
    }
    const categoryName = document.getElementById("subcategory-category").value;
    const subcategoryName = document.getElementById("subcategory-name").value;
    if (categoryName && subcategoryName) {
        const categoryObj = categories.find(c => c.name === categoryName);
        if (categoryObj) {
            const randomColor = generateColor("#ff6347"); // 使用一级分类颜色生成二级分类颜色
            const subcategoryObj = { name: subcategoryName, color: randomColor, links: [] };
            categoryObj.subcategories.push(subcategoryObj);
            localStorage.setItem('categories', JSON.stringify(categories));
            updateLinks(); // 刷新页面
        }
        closeAddSubcategoryForm();
    }
}
// 更新分类选择器
function updateCategorySelector() {
    const categorySelector = document.getElementById("category");
    categorySelector.innerHTML = '<option value="all">全部</option>';
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category.name;
        option.textContent = category.name;
        categorySelector.appendChild(option);
    });
}
