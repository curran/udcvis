function err(returnData) {
	if (returnData.substring(2, 7) == "error") {
		alert(eval("(" + returnData + ")").error);
		return true;
	} else
		return false;
}
//function ln(x){
//	return Math.log(x)/Math.log(2);
//}