/* 連續觸發法 */

// 防彈跳間隔刷新時間
const DEBOUNCE_TIMEOUT_LED = 20;
const DEBOUNCE_TIMEOUT_SERVO = 100;

// 等待控件建構完成，進行初始化
$(document).ready(function () {
	$("#bt_ledon").click(function () {
		$.get("/ledon", function () {
			console.log("LED ON");
		});
	});
	$("#bt_ledoff").click(function () {
		$.get("/ledoff", function () {
			console.log("LED OFF");
		});
	});
	$("#tb_lightness").val($("#sld_lightness").val());
	$("#tb_servo").val($("#sld_servo").val());
	//document.getElementById("tb_lightness").value = document.getElementById("sld_lightness").value;
	//document.getElementById("tb_servoAngle").value = document.getElementById("sld_servoAngle").value;
	//$.get("/lightness/" + document.getElementById("sld_lightness").value);
	//$.get("/servo/" + document.getElementById("sld_servoAngle").value);
});


// 將處理函式抽象化，因處理流程是相同的(此function請使用call或apply來調用，需指名this指向誰，否則會變global物件)
var debouncefn = debounce(function () {
	// 取得物件數值
	const value = this.value;
	// 將id字串正規化
	const obj = this.id.toString().replace("sld_", "");
	// 將資料使用GET方法，將資料丟給後端處理
	$.get("/" + obj + "/" + value, function () {
		console.log(obj, value);
		// 更新前端資訊
		$("#tb_" + obj).val(value);
	});
}, 50);



var lightnessDebounceFn = debounce(function () {
	const value = $("#sld_lightness").val();

	// 將資料使用GET方法，將資料丟給後端處理
	$.get("/lightness/" + value, function () {
		console.log("lightness:", value);
	});
	// 將目前資料同步顯示到網頁
	$("#tb_lightness").val(value);
	//document.getElementById("tb_lightness").value = value; 
}, DEBOUNCE_TIMEOUT_LED);

var servoAngleDebounceFn = debounce(function () {
	const value = $("#sld_servo").val();

	// 將資料使用GET方法，將資料丟給後端處理
	$.get("/servo/" + value, function (data, status) {
		console.log("servo:", value);
	});
	// 將目前資料同步顯示到網頁
	$("#tb_servo").val(value);
	//document.getElementById("tb_servoAngle").value = value; 

}, DEBOUNCE_TIMEOUT_SERVO);

// 偵測id為sld_lightness輸入是否改變，如改變則回調lightnessDebounceFn副程式(同時綁定input與change)
$(document).on("input", "input[type=range]", debouncefn);

//$(document).on("input change", "#sld_lightness", debouncefn);
//$(document).on("input change", "#sld_servo", debouncefn);
/*  防彈跳(防止sliderbar快速觸發事件)
 *	func => 回調函式
 *  wait => 等待時間(毫秒單位)
 *  immediate => 傳入ture則立即觸發回調(前緣觸發)
 */
function debounce(func, wait, immediate) {

	// 計時器，用來查看是否超時
	var timeout;
	// 回傳防彈跳函式表達式
	return function () {
		// 紀錄函式調用時的上下文與傳入的參數，以便待會傳入給func使用
		// 這裡的this指的是觸發的物件
		// 而arguments指的是this觸發的事件，以陣列表示(但不具陣列性質)
		var context = this, args = arguments;
		var later = function () {
			// 將計時器GC
			timeout = null;
			// 呼叫回調(這邊使用apply而不是直接呼叫是因為要將this傳入)，可參閱js this的特性
			if (!immediate) func.apply(context, args);
		};
		// !timeout 為null或undefined為true
		var callNow = immediate && !timeout;
		// 清除計時器
		clearTimeout(timeout);
		// 設定計時器超時時間(如超時調用later)
		timeout = setTimeout(later, wait);
		// 呼叫回調
		if (callNow) func.apply(context, args);
	};
};