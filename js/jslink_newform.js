var ingredientsContainer = 'currentIngredients';
var ingredientQty = "ingredientQty";
var ingredientUnit = "ingredientUnit";
var ingredientDescription = "ingredientDescription";
var ingredientProductId = "ingredientProductId";
var ingredientDelimiter = "|";

(function () {
    if (typeof SPClientTemplates === 'undefined')
        return;

    var ingredientsCtx = {};

    ingredientsCtx.Templates = {};
    //associate the various templates with rendering functions for our field.
    //when a list view is returned to the user, SharePoint will fire the function associate with 'View'.
    //when a list item is in New, SharePoint will fire the function associated with NewForm, etc.
    ingredientsCtx.Templates.Fields = {
        //RecipeIngredients is the Name of our field
        'RecipeIngredients': {
            'View': ingredientsView,
            'DisplayForm': ingredientsDisplayForm,
            'EditForm': ingredientsNewAndEdit, //using the same function for New and Edit, but they could be different
            'NewForm': ingredientsNewAndEdit
        }
    };

    //register the template to render our field
    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(ingredientsCtx);

})();

//function called when our field is shown in a View
function ingredientsView(ctx) {
    var currentVal = '';
    //from the context get the current item and it's value
    if (ctx != null && ctx.CurrentItem != null)
        currentVal = ctx.CurrentItem[ctx.CurrentFieldSchema.Name];

    var currentItemValueId = 'ingredientValue_' + ctx.CurrentItem['ID'];

    //create a hidden div to store the current item's value within the View
    var html = '<div id="' + currentItemValueId + '" style="display:none">';
    html += RenderExistingValues(ctx, false);
    html += '</div>';
    //render a 'Show Me' button. When clicked the value from the Div above will be cloned, then shown in dialog window
    html += '<input type="button" value="Show Value" onclick="showIngredientsValue(\'' + currentItemValueId + '\')" />';

    return html;
}

//function is called with item is displayed on Display form
function ingredientsDisplayForm(ctx) {
    if (ctx == null || ctx.CurrentFieldValue == null)
        return '';

    //decode the string to replace entities by HTML characters
    return RenderExistingValues(ctx, false);
}

//function called when an item with our field is in edit mode or new mode.
function ingredientsNewAndEdit(ctx) {
    if (ctx == null || ctx.CurrentFieldValue == null)
        return '';

    var formCtx = SPClientTemplates.Utility.GetFormContextForCurrentField(ctx);
    if (formCtx == null || formCtx.fieldSchema == null)
        return '';

    //register callback functions that SharePoint will call at appropriate times
    RegisterCallBacks(formCtx);

    //render the Input controls for the ingredient
    var html = RenderInputFields();

    //render a reminder for user experience
    html += '<b>Current Ingredients:</b>';

    //render existing values
    html += RenderExistingValues(ctx, true);

    return html;
}

//registers call back functions from SharePoint
function RegisterCallBacks(formCtx) {

    //when the form is initialized, call our anonymous function. 
    formCtx.registerInitCallback(formCtx.fieldName, function () {

        //get the controls in the input form
        var qtyInput = document.getElementById(ingredientQty);
        var unitInput = document.getElementById(ingredientUnit);
        var descInput = document.getElementById(ingredientDescription);
        var prodIdInput = document.getElementById(ingredientProductId);
        //add all of them to an array
        var elements = [qtyInput, unitInput, descInput, prodIdInput];

        //foreach element, register a keydown event to add an ingredient when the user hits enter
        for (var i = 0; i < elements.length; i++) {
            var input = elements[i];
            if (input != null) {
                AddEvtHandler(input, "onkeydown", function (e) {
                    //keyCode == 13 is Enter
                    if (e.keyCode == 13) {
                        addIngredient();
                    }
                });
            }
        }
    });

    //This is where the magic happens! After the user clicks save, call this function. In this function, set the item field value.
    formCtx.registerGetValueCallback(formCtx.fieldName, function () {
        //get our unordered list of current ingredients
        var ul = document.getElementById(ingredientsContainer);
        if (ul == null)
            return null;
        else {
            //return the values, which will be stored in the list item
            return getFieldValueFromDOM(ul);
        }

    });

    //create container for various validators
    var validators = new SPClientForms.ClientValidation.ValidatorSet();

    //if the field is required, make sure we handle that
    if (formCtx.fieldSchema.Required) {
        //add a required field validator to the collection of validators
        validators.RegisterValidator(new SPClientForms.ClientValidation.RequiredValidator());
    }

    //if we have any validators, register those
    if (validators._registeredValidators.length > 0) {
        formCtx.registerClientValidator(formCtx.fieldName, validators);
    }

    //when there's a validation error, call this function
    formCtx.registerValidationErrorCallback(formCtx.fieldName, function (errorResult) {
        SPFormControl_AppendValidationErrorMessage(ingredientsContainer, errorResult);
    });
}

//render the controls that allow users to add individual ingredients
function RenderInputFields() {
    var html = '<table>';
    html += '<tr><td>Qty</td><td>Unit of Measure</td><td>Description</td><td>Product Id</td><td></td></tr>';
    html += '<tr>';
    html += '<td><input id="' + ingredientQty + '" type="text"></td>';
    html += '<td><select id="' + ingredientUnit + '">';
    html += '<option value=""></option>';
    html += '<option value="cup">Cup</option>';
    html += '<option value="gallon">Gallon</option>';
    html += '<option value="oz">Oz</option>';
    html += '<option value="pinch">Pinch</option>';
    html += '<option value="pt">Pt</option>';
    html += '<option value="lb">Lb</option>';
    html += '</select></td>';
    html += '<td><input id="' + ingredientDescription + '" type="text"></td>';
    html += '<td><input id="' + ingredientProductId + '" type="text"></td>';
    //add a button with an onclick event for addIngredient. this will add a li element to the ingredients container UL
    html += '<td><input id="btnAdd" type="button" onclick="addIngredient()" value="Add"><input type="button" value="Show Recommendations" onclick="showIngredientsValue()" /></td>';
    html += '</tr></table>';
    html += '<input id="file1" type="file" onchange="updateFile(this)" />';
    html += '<img width="200px" id="blah" src="#" alt="your image" /><br />';    
    html += '<input type="button" id="btnUpload" onclick="uploadSP()" value="Confirm preview and upload to SharePoint" />';
    return html;
}

function uploadSP() {
    //using PnP core JS to upload
    //Get the file from File DOM
    //instantiate the es6-promise shim
    console.log('uploadSP routine');
    ES6Promise.polyfill();
var files = document.getElementById('file1').files;
var file = files[0];
 console.log('attempting upload to SP');
//Upload a file to the SharePoint Library

//no start slash required
$pnp.sp.web.getFolderByServerRelativeUrl("Pictures/NS Photos") 
 .files.add(file.name, file, true)
 .then(function(data) {
    alert(file.name + " upload successfully!");
 //document.getElementById("sample").innerHTML = file.name + " uploaded successfully!"
 });
}

//var fileuploadBuffer;
function updateFile(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        // adapted from http://stackoverflow.com/questions/4459379/preview-an-image-before-it-is-uploaded
        reader.onload = function (e) {
            $('#blah').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
        //reader.readAsBinaryString(input.files[0]);
        //reader.onload = function(e) { //save the byte array here http://blog.teamtreehouse.com/reading-files-using-the-html5-filereader-api
        //    fileuploadBuffer = e.target.result;
        //}
    }

}

document.querySelector('input').addEventListener('change', function() {
alert('change event fired');
  var reader = new FileReader();
  reader.onload = function() {

    var arrayBuffer = this.result,
      array = new Uint8Array(arrayBuffer),
      binaryString = String.fromCharCode.apply(null, array);

    console.log(binaryString);

  }
  reader.readAsArrayBuffer(this.files[0]);

}, false);

//render the value from the current item
function RenderExistingValues(ctx, includeDelete) {
    var html = '';
    html += '<form action="javascript:return;">';
    html += '<ul id="' + ingredientsContainer + '">';
    //call a helper function to retrieve the fields value
    var fieldValue = getValue(ctx);

    var ingredients = fieldValue.split(ingredientDelimiter);

    for (var i = 0; i < ingredients.length; i++) {
        var ingredient = ingredients[i];
        var qty = getAttributeFromFieldValue('qty', ingredient);
        var unit = getAttributeFromFieldValue('unit', ingredient);
        var desc = getAttributeFromFieldValue('desc', ingredient);
        var prodId = getAttributeFromFieldValue('prodId', ingredient);

        if (ingredient != '') {
            html += '<li>';
            html += getLIInnerHtml(qty, unit, desc, prodId, includeDelete);
            html += '</li>';
        }
    }

    html += '</ul></form>';

    return html;
}

//adds the ingredient from the input control to the currentIngredients div
function addIngredient() {
    //get the container div
    var container = document.getElementById(ingredientsContainer);
    var qtyInput = document.getElementById(ingredientQty);
    var unitInput = document.getElementById(ingredientUnit);
    var descInput = document.getElementById(ingredientDescription);
    var prodIdInput = document.getElementById(ingredientProductId);

    //create a new list item 
    var li = document.createElement('LI');
    //add to the unordered list parent
    container.appendChild(li);

    //add the html to the li
    li.innerHTML = getLIInnerHtml(qtyInput.value, unitInput.value, descInput.value, prodIdInput.value, true);;

    //clear input controls
    qtyInput.value = "";
    unitInput.value = "";
    descInput.value = "";
    prodIdInput.value = "";

    //focus back to the quantity text box
    qtyInput.focus();
}

//opens a sharepoint dialog window to display value
function showIngredientsValue() {
    //calling the showModalDialog function with a DOM element.
    //by default, that DoM element is destroyed when the dialog closes so
    //we must clone the div we want to show. Otherwise the dialog would only work once
console.log('opening up modal dialog');
//check for existing value in enterprise keywords
var prodIdInput1 = document.getElementById("TaxKeyword_$containereditableRegion");
console.log(prodIdInput1);
    //establish a clone id
    //var cloneDiv = ingredientsDisplayDivId + '_clone';

    //get the div with the value
    //var divWithValue = document.getElementById(ingredientsDisplayDivId);

    //create a clone DOM element
    var clone = document.createElement('DIV');

    //divWithValue.appendChild(clone);

var html1 = "<p>Hello</p>";

    //use the same innerhtml for the clone
    //clone.innerHTML = divWithValue.innerHTML + html1;
    clone.innerHTML = html1;

    SP.UI.ModalDialog.showModalDialog({
        title: 'Current Ingredients',
        //html: clone, //pass in the clone which can be destroyed. Next time the function is called, we'll create another clone.
        width: 450,
        url: "/sites/teamsite2/sitepages/test.aspx",
        height: 350,
        dialogReturnValueCallback: Function.createDelegate(null,portal_BaseCallback)
    });
}

function portal_BaseCallback(result, value) {
        if (result === SP.UI.DialogResult.OK) {
        // here I need to transfer value to C# code behind to process
            console.log("OK");
        }
        if (result === SP.UI.DialogResult.cancel) {
        //user press Cancel, ignore it
            console.log("cancelled");
        }
        console.log(value);
    }

//uses the unorderd list of current ingredients to build a field value
function getFieldValueFromDOM(ul) {
    var value = '';

    //foreach list item, get hidden div values
    for (var i = 0; i < ul.childNodes.length; i++) {
        var li = ul.childNodes[i];

        //when an ingredient was added, we included a div with display=none. this has a field valu
        value += li.getElementsByTagName('div')[0].innerHTML;
    }

    if (value == '')
        return null;
    else
        return value;
}

function deleteIngredient(button) {
    var li = button.parentNode;
    var ul = li.parentNode;
    ul.removeChild(li);
}

//=======================================================================================================
//helper methods
//=======================================================================================================
//returns a string specially formated for storage in the item's ingredients field
function getFieldValue(qty, unit, desc, prodId) {
    var value = '';
    if (qty != '')
        value += '{qty=' + qty + '}';

    if (unit != '')
        value += '{unit=' + unit + '}';

    if (desc != '')
        value += '{desc=' + desc + '}';

    if (prodId != '')
        value += '{prodId=' + prodId + '}';

    if (value != '')
        value += ingredientDelimiter;

    return value;
}

//returns an html stringe formatted an unordered list item for current ingredients
function getLIInnerHtml(qty, unit, desc, prodId, includeDelete) {
    var html = '';
    if (qty != '') {
        html += '<span class="ingredientQty">' + qty + '</span> ';
    }

    if (unit != '')
        html += unit + ' ';

    if (desc != '') {

        if (prodId != '')
            html += '<img src="' + prodId + '" />';

        html += desc;

        if (prodId != '')
            html += '</a>';
    }

    if (includeDelete) {
        html += '  <input type="image" src="~/_layouts/15/images/delete.gif" value="Delete" onclick="deleteIngredient(this)" >';
    }

    html += '<div style="display:none">';
    html += getFieldValue(qty, unit, desc, prodId);
    html += '</div>';

    return html;
}

//returns an attribute of an ingredient from a field value
function getAttributeFromFieldValue(qry, value) {
    var val = '';
    var fullQry = '{' + qry + '=';

    //find the index of the product id
    var i = value.indexOf(fullQry);

    if (i >= 0) {
        //get the next }.
        var z = value.indexOf('}', i + fullQry.length);

        //get the product id
        val = value.substring(i + fullQry.length, z);
    }

    return val;
}

function getValue(ctx) {
    var val = null;

    if (ctx != null && ctx.CurrentItem != null)
        val = ctx.CurrentItem[ctx.CurrentFieldSchema.Name];

    val = STSHtmlDecode(val);

    //if val begins with <div, we're in display mode so only return what's inside the div
    if (val.startsWith('<div dir')) {
        var div = document.createElement('DIV');
        div.innerHTML = val;

        val = div.firstChild.innerHTML;
    }

    return val;
}

function getFieldName(ctx) {
    return ctx.CurrentFieldSchema.Name;
}

if (typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function (str) {
        return str.length > 0 && this.substring(0, str.length) === str;
    }
};

if (typeof String.prototype.endsWith != 'function') {
    String.prototype.endsWith = function (str) {
        return str.length > 0 && this.substring(this.length - str.length, this.length) === str;
    }
};



/*$(':file').change(function(){
    
    var file = this.files[0];
    alert('file ' + file);
    name = file.name;
    size = file.size;
    type = file.type;

    if(file.name.length < 1) {
    }
    else if(file.size > 100000) {
        alert("The file is too big");
    }
    else if(file.type != 'image/png' && file.type != 'image/jpg' && file.type != 'image/gif' && file.type != 'image/jpeg' ) {
        alert("The file does not match png, jpg or gif");
    }
    else { 
        $(':submit').click(function(){
            var formData = new FormData($('*formId*')[0]);
            $.ajax({
                url: 'script',  //server script to process data
                type: 'POST',
                xhr: function() {  // custom xhr
                    myXhr = $.ajaxSettings.xhr();
                    if(myXhr.upload){ // if upload property exists
                        myXhr.upload.addEventListener('progress', progressHandlingFunction, false); // progressbar
                    }
                    return myXhr;
                },
                // Ajax events
                success: completeHandler = function(data) {
                    
                    * Workaround for Chrome browser // Delete the fake path
                    
                    if(navigator.userAgent.indexOf('Chrome')) {
                        var catchFile = $(":file").val().replace(/C:\\fakepath\\/i, '');
                    }
                    else {
                        var catchFile = $(":file").val();
                    }
                    var writeFile = $(":file");
                    writeFile.html(writer(catchFile));
                    $("*setIdOfImageInHiddenInput*").val(data.logo_id);
                },
                error: errorHandler = function() {
                    alert("Something went wrong!");
                },
                // Form data
                data: formData,
                // Options to tell jQuery not to process data or worry about the content-type
                cache: false,
                contentType: false,
                processData: false
            }, 'json');
        });
    }
});*/
