var lastFormat = 'readable';

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function myOnLoad() {
    document.getElementById("my_input").value = getCookie("my_input");
//    document.getElementById("my_input").rows = getCookie("my_input_rows");
//    document.getElementById("my_input").cols = getCookie("my_input_cols");
    document.getElementById("my_input").focus();
}

function doFormat(f = 'readable') {
    document.getElementById("my_input").value = formatNestedCall(document.getElementById("my_input").value, f);
    document.cookie = "my_input=" + encodeURIComponent(document.getElementById("my_input").value);
    document.cookie = "my_input_rows=" + document.getElementById("my_input").rows;
    document.cookie = "my_input_cols=" + document.getElementById("my_input").cols;
    document.getElementById("my_input").focus();
}

function formatNestedCall(str = '', f = 'readable') {
  lastFormat = f;  

  var out_str = "";
  
  var nest_level = 0;
  var tab_length = 4;
  var buffer = "";
  var in_protected_string = "";

  for (var i = 0; i < str.length; i++) {
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

      if (in_protected_string != "") {
          buffer = buffer + str.charAt(i);
          continue;
      }
      
      
      if (str.charAt(i) == "(") {
          out_str = out_str + str.charAt(i);

          nest_level = nest_level + 1;

          if (f == 'readable') {
              buffer = "\n" + " ".repeat(nest_level * tab_length);
          }
      }
      else if (str.charAt(i) == ")") {
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
      else if (str.charAt(i) == " " || str.charAt(i) == "\n") {
          
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
      out_str = out_str + buffer;
  }
  out_str = out_str + "\n";

  return out_str;
}

$(function ()
{
    $(document).on("keydown", "#my_input", function(e)
    {
        if ((e.keyCode == 10 || e.keyCode == 13) && e.ctrlKey)
        {
            if (lastFormat == 'readable') {
                lastFormat = 'grafana';
            }
            else {
                lastFormat = 'readable';
            }

            doFormat(lastFormat);
        }
    });
});
