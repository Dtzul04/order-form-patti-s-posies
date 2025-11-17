$(document).ready(function () {
    $('#name').focus();

    $("#name").blur(function () {
        checkRequired("#name", "#nameErr")
    });

    $("#address").blur(function () {
        checkRequired("#address", "#addressErr")
    });

    $("#city").blur(function () {
        checkRequired("#city", "#cityErr")
    });

    $("#zip").blur(function () {
        checkZip("#zip", "#zipErr");
    });

    $("#shipzip").blur(function () {
        checkZip("#shipzip", "#shipzipErr");
    });

    $("#copy").change(function () {
        if ($(this).is(":checked")) {
    
        $("#shipaddr").val($("#address").val());
        $("#shipcity").val($("#city").val());
        $("#shipzip").val($("#zip").val());

        let billingState = $("#state").val();
        $("#shipstate").val(billingState);

        $("#shipaddrErr").text("");
        $("#shipcityErr").text("");
        $("#shipzipErr").text("");
        $("#shipstateErr").text("");
    } 

     else {
        $("#shipaddr").val("");
        $("#shipcity").val("");
        $("#shipzip").val("");
        $("#shipstate").val("TX");  

        $("#shipaddrErr").text("");
        $("#shipcityErr").text("");
        $("#shipzipErr").text("");
        $("#shipstateErr").text("");
    }
    });

    $(".qty").blur(function () {
        calculateOrder();
    });

    $("#order").submit(function (e) {

    let valid = true;

    if (!checkRequired("#name", "#nameErr")) valid = false;
    if (!checkRequired("#address", "#addressErr")) valid = false;
    if (!checkRequired("#city", "#cityErr")) valid = false;
    if (!checkZip("#zip", "#zipErr")) valid = false;

    if (!checkEmail()) valid = false;
    if (!checkEmailMatch()) valid = false;

    if (!($("#copy").is(":checked"))) {
        if (!checkRequired("#shipaddr", "#shipaddrErr")) valid = false;
        if (!checkRequired("#shipcity", "#shipcityErr")) valid = false;
        if (!checkZip("#shipzip", "#shipzipErr")) valid = false;
    }

    calculateOrder();

    if (!valid) {
        e.preventDefault();
        $("#orderErr").text("Please correct the errors above before submitting.");
    } else {
        $("#orderErr").text(""); 
    }
});

});

function checkRequired(id, errId) {
    let value = $(id).val().trim();
    if (value === "") {
        $(errId).text("Required");
        return false;
    } else {
        $(errId).text("");
        return value;
    }
}

function checkZip(id, errId) {
    let zip = $(id).val().trim();

    if (zip === "") {
        $(errId).text("Required");
        return false;
    }

    if (!/^\d{5}$/.test(zip)) {
        $(errId).text("Must be 5 digits");
        return false;
    }

    $(errId).text("");
    return true;
}

function calculateRow(index) {
    let qty = $("#" + index).val().trim();

    if (isNaN(qty) || qty === "") {
        qty = 0;
        $("#" + index).val(0);
    }

    let price = parseFloat($("#price" + index).text());
    let rowTotal = price * qty;

    $("#total" + index).text(rowTotal.toFixed(2));

    return rowTotal;
}

function calculateOrder() {
    let subtotal = 0;

    for (let i =1; i <= 3; i++) {
        subtotal += calculateRow(i);
    }

    $("#subt").text(subtotal.toFixed(2));

    let shipState = $("#shipstate").val();
    let tax = 0;

    if (shipState === "TX") {
        tax = subtotal * 0.08;
    }

    $("#tax").text(tax.toFixed(2));

    let shipping = 0;

    if (shipState === "TX") {
        shipping = 5;
    } else if (shipState === "CA" || shipState === "NY") {
        shipping = 20;
    } else {
        shipping = 10;
    }

    $("#ship").text(shipping.toFixed(2));

    let grandTotal = subtotal + tax + shipping;

    $("#gTotal").text(grandTotal.toFixed(2));
}

