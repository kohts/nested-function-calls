var lastFormat = 'readable';

function doReplace(aText, aReplaceWhat, aReplaceWith) {
    // Nothing should prevent you from just escaping every non-alphanumeric character:
    var replaceWhatEscaped = aReplaceWhat.replace(/(?=\W)/g, '\\');
    //
    // You lose a certain degree of readability when doing re.toString()
    // but you win a great deal of simplicity (and security).
    //
    // According to ECMA-262, on the one hand, regular expression "syntax characters"
    // are always non-alphanumeric, such that the result is secure, and
    // special escape sequences (\d, \w, \n) are always alphanumeric such that
    // no false control escapes will be produced.

    var replaceWhatRegex = new RegExp(replaceWhatEscaped, 'g');

    return aText.replace(replaceWhatRegex, aReplaceWith);
}

function myOnLoad() {
    $(function() {
        $("#search_and_replace").dialog({
            autoOpen : false,
            modal : true,
            show : "blind",
            hide : "blind",
            buttons: [
                {
                    text: 'Replace',
                    id: 'btnReplace',
                    click: function () {
                        var reply = window.confirm('Replace' + "\n" +
                            document.getElementById("search_field").value + "\n" +
                            'with' + "\n" +
                            document.getElementById("replace_field").value +
                            "\n" + '?'
                            );

                        if (reply) {
                            Cookies.set('search_field', document.getElementById("search_field").value, { expires: 365 });
                            Cookies.set('replace_field', document.getElementById("replace_field").value, { expires: 365 });

                            document.getElementById("my_input").value = doReplace(
                                document.getElementById("my_input").value,
                                document.getElementById("search_field").value,
                                document.getElementById("replace_field").value
                                );
                            
                            $(this).dialog('close');
                        }
                    }
                },
                {
                    text: 'Cancel',
                    id: 'btnCancel',
                    click: function () {
                        $(this).dialog('close');
                    }
                }            
            ]
        });
    });

    $(function () {
        $(document).on("keydown", "#search_field", function(e) {
            if ((e.keyCode == 10 || e.keyCode == 13)) {
                document.getElementById("replace_field").focus();
            }
        });
        $(document).on("keydown", "#replace_field", function(e) {
            if ((e.keyCode == 10 || e.keyCode == 13)) {
                document.getElementById("btnReplace").click();
            }
        });

        $(document).on("keydown", "#my_input", function(e) {
            if ((e.keyCode == 10 || e.keyCode == 13) && e.ctrlKey) {
                if (lastFormat == 'readable') {
                    lastFormat = 'oneliner';
                }
                else {
                    lastFormat = 'readable';
                }

                doFormat(lastFormat);
            }
            
            if (e.ctrlKey && String.fromCharCode(e.which).toLowerCase() == 'h') {
                $("#search_and_replace").dialog('open');
                return false;
            }
        });
    });

    if (typeof Cookies.get('my_input_format') != 'undefined') {
        lastFormat = Cookies.get('my_input_format');
    }

    document.getElementById("my_input").value = Cookies.get('my_input');
    document.getElementById("my_input").style.width = Cookies.get("my_input_width");
    document.getElementById("my_input").style.height = Cookies.get("my_input_height");
    document.getElementById("my_input").focus();
    
    if (! isNaN(Cookies.get("my_input_position"))) {
        document.getElementById("my_input").setSelectionRange(Cookies.get("my_input_position"), Cookies.get("my_input_position"));
    }

    document.getElementById("search_field").value = Cookies.get('search_field');
    document.getElementById("replace_field").value = Cookies.get('replace_field');
}

function save_cookies() {
    Cookies.set('my_input_format', lastFormat, { expires: 365 });
    Cookies.set('my_input', document.getElementById("my_input").value, { expires: 365 });
    Cookies.set('my_input_width', document.getElementById("my_input").style.width, { expires: 365 });
    Cookies.set('my_input_height', document.getElementById("my_input").style.height, { expires: 365 });
    Cookies.set('my_input_position', document.getElementById("my_input").selectionStart, { expires: 365 });
}

function doFormat(targetFormat = 'readable') {
    var origSelectionStart = document.getElementById("my_input").selectionStart;

    var nestedCallOutput =
        formatNestedCall(
            document.getElementById("my_input").value,
            targetFormat,
            origSelectionStart
            );
    document.getElementById("my_input").value = nestedCallOutput.out_str;

    document.getElementById("my_input").focus();
    document.getElementById("my_input").setSelectionRange(nestedCallOutput.newCursorPos, nestedCallOutput.newCursorPos);

    save_cookies();
}

function formatNestedCall(str = '', targetFormat = 'readable', cursorPosition = 0) {
    lastFormat = targetFormat;

    var out_str = "";
    var newCursorPos;

    var nest_level = 0;
    var tab_length = 4;
    var buffer = "";
    var in_protected_string = "";

    for (var i = 0; i < str.length; i++) {

        if (isNaN(newCursorPos) && i >= cursorPosition) {
            newCursorPos = out_str.length;
//            alert(out_str);
        }

        // start/end of quoted string
        //
        if (str.charAt(i) == "'" || str.charAt(i) == '"') {
            if (in_protected_string != "") {
                if (in_protected_string == str.charAt(i)) {
                    in_protected_string = "";
                }
            }
            else {
                in_protected_string = str.charAt(i);
            }
            buffer = buffer + str.charAt(i);
            continue;
        }

        // ignore brackets inside of strings
        //
        if (in_protected_string != "") {
            buffer = buffer + str.charAt(i);
            continue;
        }
      
      
        if (str.charAt(i) == "(" || str.charAt(i) == "{") {
            out_str = out_str + str.charAt(i);

            nest_level = nest_level + 1;

            if (targetFormat == 'readable') {
                buffer = "\n" + " ".repeat(nest_level * tab_length);
            }
        }
        else if (str.charAt(i) == ")" || str.charAt(i) == "}") {
            if (nest_level > 0) {
                nest_level = nest_level - 1;
            }

            if (targetFormat == 'readable') {
                buffer = buffer + "\n" + " ".repeat(nest_level * tab_length);
            }
            buffer = buffer + str.charAt(i);
        }
        else if (str.charAt(i) == ",") {
            buffer = buffer + str.charAt(i);
          
            if (targetFormat == 'readable') {
                buffer = buffer + "\n" + " ".repeat(nest_level * tab_length);
            }
            else {
                buffer = buffer + " ";
            }
        }
        else if (str.charAt(i) == " ") {

        }
        else if (str.charAt(i) == "\n") {
            if (nest_level == 0) {
                buffer = buffer + str.charAt(i);
            }
        }
        else {
            if (buffer != "") {
                out_str = out_str + buffer + str.charAt(i);
                buffer = "";
            }
            else {
                out_str = out_str + str.charAt(i);
            }
        }
    }

    if (buffer != "") {
        var regex = /\n/g;
        var tmp_buffer = buffer.replace(regex, '');

        // omit append multiple carriage returns at the end of text field
        if (tmp_buffer != "") {
            out_str = out_str + buffer;
        }
    }
    if (out_str.charAt(out_str.length - 1) != "\n") {
        out_str = out_str + "\n";
    }

    return {
        out_str: out_str,
        newCursorPos: newCursorPos
        };
}
