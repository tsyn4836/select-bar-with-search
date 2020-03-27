(function (document, window) {

	// 公共方法
	$ = function (child, parent = document) {
		return parent.querySelector(child);
	}
	$$ = function (child, parent = document) {
		return parent.querySelectorAll(child);
	}

	class Select {
		constructor({ options, optionsFrom, wrap, output }) {
			this.options = options || this.getOptions(optionsFrom) || {};
			this.wrap = wrap;
			this.output = output;
			this.render(this.options);
			this.bindEvents();
		}

		getOptions(optionsFrom) {
			let options = {};
			optionsFrom.forEach(item => {
				let type = item.getAttribute("type");
				let value = item.value;
				let text = item.text;
				// console.log(type,value,text);

				// 创建options的分类
				if (!options.hasOwnProperty(type)) {
					options[type] = [];
				}

				// 把option压入对应的类型中
				options[type].push({
					value,
					text
				})
			})

			return options;
		}

		render(options) {
			let select = document.createElement("div");
			select.className = "select";
			let html = `
                <div class="select-caption">
                    <span class="select-value">未选择</span>
                    <span class="select-arrow">▼</span>
                </div>
                <div class="select-body">
                    <input class="select-filter" placeholder="搜索">
                    <div class="select-result">
                        ${_creatOptgroupHTML(options)}\
                    </div>
                </div>
            `;
			select.innerHTML = html;
			this.wrap.appendChild(select);

			// 创建选项组的HTML
			function _creatOptgroupHTML(options) {
				let optgroupHTML = "";
				for (let type in options) {
					optgroupHTML += `
                    <div class="optgroup">
                        <div class="optgroup-label">${type}</div>
                        ${_creatOptionsByType(options[type])}
                    </div>
                    `;
				}
				return optgroupHTML;
			}
			// 根据每个选项的类型,在对应选项组下创建HTML
			function _creatOptionsByType(type) {
				let optionHTML = "";
				type.forEach(function (option) {
					optionHTML += `<div class="option" value="${option.value}">${option.text}</div>
                    `
				})
				return optionHTML;
			}
		}

		bindEvents() {
			let _selectBody = $(".select-body");
			let _optionItems = $$(".option");
			let _show = false;
			// 显示下拉菜单
			$(".select-caption", this.wrap).addEventListener("click", e => {
				e.stopPropagation();
				if (!_show) {
					_selectBody.style.display = "block";
				}
				_show = true;
			});

			// 隐藏下拉菜单
			$("body").addEventListener("click", e => {
				e.stopPropagation();
				if (_show) {
					_selectBody.style.display = "none";
				}
				_show = false;
			});

			_selectBody.addEventListener("click", e => {
				e.stopPropagation();
			});

			// 搜索栏筛选
			$(".select-filter").addEventListener("input", e => {
				let regex = new RegExp(e.target.value, "ig");
				_optionItems.forEach(option => {
					if (!regex.test(option.innerHTML)) {
						option.style.display = "none";
					} else {
						option.style.display = "block";
					}
				})
			})

			// 点击option显示前后的选项和值,然后隐藏optionBody
			_optionItems.forEach(option => {
				option.addEventListener("click", e => {
					e.stopPropagation();

					let before = $(".select-value");
					let after = option;

					// 输出选项改变前后的变化
					_change_output(before, after, this.output);

					// select显示的值从before变成after
					before.innerHTML = after.innerHTML;
					before.setAttribute("value", after.getAttribute("value"));

					_selectBody.style.display = "none";
					_show = false;
				});
			})

			function _change_output(before, after, output) {
				// 如果没有设置输出选项变化的节点，那就不输出了
				if (!output) return;
				output.innerHTML =
					`之前的值是:${before.innerHTML} - ${before.getAttribute("value")} \n` +
					`之后的值是:${after.innerHTML} - ${after.getAttribute("value")}`;
			}
		}
	}

	window.Select = Select;
	
})(document, window)

