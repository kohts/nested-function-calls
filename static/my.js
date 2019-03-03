var lastFormat = 'readable';

function doReplace(aText, aReplaceWhat, aReplaceWith) {
    var re = new RegExp(aReplaceWhat, 'g');
    return aText.replace(re, aReplaceWith);
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
                        var reply = window.confirm('Replace ' +
                            document.getElementById("search_field").value +
                            ' with ' +
                            document.getElementById("replace_field").value +
                            '?'
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

    document.getElementById("my_input").value = Cookies.get('my_input');
    document.getElementById("my_input").style.width = Cookies.get("my_input_width");
    document.getElementById("my_input").style.height = Cookies.get("my_input_height");
    document.getElementById("my_input").focus();

    document.getElementById("search_field").value = Cookies.get('search_field');
    document.getElementById("replace_field").value = Cookies.get('replace_field');
}

function save_cookies() {
    Cookies.set('my_input', document.getElementById("my_input").value, { expires: 365 });
    Cookies.set('my_input_width', document.getElementById("my_input").style.width, { expires: 365 });
    Cookies.set('my_input_height', document.getElementById("my_input").style.height, { expires: 365 });
}

function doFormat(f = 'readable') {
    document.getElementById("my_input").value = formatNestedCall(document.getElementById("my_input").value, f);
    document.getElementById("my_input").focus();
    save_cookies();
}

function formatNestedCall(str = '', f = 'readable') {
  lastFormat = f;  

  var out_str = "";
  
  var nest_level = 0;
  var tab_length = 4;
  var buffer = "";
  var in_protected_string = "";

  for (var i = 0; i < str.length; i++) {

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

          if (f == 'readable') {
              buffer = "\n" + " ".repeat(nest_level * tab_length);
          }
      }
      else if (str.charAt(i) == ")" || str.charAt(i) == "}") {
          if (nest_level > 0) {
              nest_level = nest_level - 1;
          }

          if (f == 'readable') {
              buffer = buffer + "\n" + " ".repeat(nest_level * tab_length);
          }
          buffer = buffer + str.charAt(i);
      }
      else if (str.charAt(i) == ",") {
          buffer = buffer + str.charAt(i);
          
          if (f == 'readable') {
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

  return out_str;
}
