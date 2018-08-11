		/* 連續觸發法 */
		
		// 防彈跳間隔刷新時間
		const DEBOUNCE_TIMEOUT_LED = 20;
		const DEBOUNCE_TIMEOUT_SERVO = 100;
		
		// 等待控件建構完成，進行初始化
		$(document).ready(function(){
			document.getElementById("tb_lightness").value = document.getElementById("sld_lightness").value;
			document.getElementById("tb_servoAngle").value = document.getElementById("sld_servoAngle").value;
			$.get("/lightness/" + document.getElementById("sld_lightness").value);
			$.get("/servo/" + document.getElementById("sld_servoAngle").value);
		});

		// 比對與前次資料是否相同(亮度)
		var prv_light_data = null;
		var prv_servo_data = null;
		
		var lightnessDebounceFn = debounce(function() {
			const value = $("#sld_lightness").val();
			// 比對與前次資料是否相同
			if(prv_light_data !== value){
				// 將資料使用GET方法，將資料丟給後端處理
				$.get("/lightness/" + value, function(data, status){
					console.log("lightness:", value);
				});
				prv_light_data = value;
				// 將目前資料同步顯示到網頁
				document.getElementById("tb_lightness").value = value; 
			}
		}, DEBOUNCE_TIMEOUT_LED);
		
		var servoAngleDebounceFn = debounce(function() {
			const value = $("#sld_servoAngle").val();
			// 比對與前次資料是否相同
			if(prv_servo_data !== value){
				// 將資料使用GET方法，將資料丟給後端處理
				$.get("/servo/" + value, function(data, status){
					console.log("servo:", value);
				});
				prv_servo_data = value;
				// 將目前資料同步顯示到網頁
				document.getElementById("tb_servoAngle").value = value; 
			}
		}, DEBOUNCE_TIMEOUT_SERVO);
		
		// 偵測id為sld_lightness輸入是否改變，如改變則回調lightnessDebounceFn副程式
		$(document).on('input change', '#sld_lightness', lightnessDebounceFn);
		$(document).on('input change', '#sld_servoAngle', servoAngleDebounceFn);
		
		// 防彈跳(防止sliderbar快速觸發事件)
		function debounce(func, wait, immediate) {
			var timeout;
			return function() {
				var context = this, args = arguments;
				var later = function() {
					timeout = null;
					if (!immediate) func.apply(context, args);
				};
				var callNow = immediate && !timeout;
				clearTimeout(timeout);
				timeout = setTimeout(later, wait);
				if (callNow) func.apply(context, args);
			};
		};