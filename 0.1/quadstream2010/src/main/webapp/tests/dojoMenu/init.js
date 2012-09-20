function err(data) {
	if (data.substring(2, 7) == "error") {
		alert(eval("(" + data + ")").error);
		return true;
	} else
		return false;
}

function init() {
	$.get("map.pjs", function(code) {
		var scatterplot = Processing($("#scatterplotCanvas")[0], code);
		/* http://localhost:8080/data/get?q=data&d=iris&column=PetalLength,SepalLength */
		$.get("../get", {
			q : "data",
			d : "iris",
			column : "PetalLength,SepalLength"
		}, function(data) {
			if (!err(data)) {
				var d = eval("("+data+")");
//				console.log("PetalLength = " + d["PetalLength"]["values"]);
//				console.log("SepalLength = " + d["SepalLength"]["values"]);
//				console.log("n = " + d["SepalLength"]["values"].length);
				scatterplot.xs =  d["PetalLength"]["values"];
				scatterplot.ys =  d["SepalLength"]["values"];
				scatterplot.n =  d["PetalLength"]["values"].length;
				scatterplot.redraw();
			}
		});
	});
}