running in a vm (with flask installed):
  source ~/envs/hello_world/bin/activate
  cd python-docs-samples/appengine/standard_python37/hello_world/
  export FLASK_APP=main.py
  flask run --host=0.0.0.0

running tests (with nodejs installed):
  cd python-docs-samples/appengine/standard_python37/hello_world/static
  nodejs test.js

  sample output:
petr@ashes:~/python-docs-samples/appengine/standard_python37/hello_world/static$ nodejs test.js
running test [0]: OK.
running test [1]: OK.
running test [2]: OK.
running test [3]: OK.
running test [4]: OK.
running test [5]: OK.
running test [6]: OK.
petr@ashes:~/python-docs-samples/appengine/standard_python37/hello_world/static$

deploying to appspot:
   gcloud app deploy app.yaml --project nested-function-calls
