var lastFormat = 'readable';

function myOnLoad() {
    document.getElementById("my_input").value = Cookies.get('my_input');
    document.getElementById("my_input").style.width = Cookies.get("my_input_width");
    document.getElementById("my_input").style.height = Cookies.get("my_input_height");
    document.getElementById("my_input").focus();
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
