var fs = require('fs');
eval(fs.readFileSync('my.js')+'');

var tests = [
  {
      "input_parameters": ["sum(a)", "", 1], "expected_output": "sum(a)\n"
  },
  {
      "input_parameters": ["sum(a,{b,c})\n", "", 1], "expected_output": "sum(a, {b, c})\n"
  },
  {
      "input_parameters": ["sum(a, b, c, d, e)", "readable", 1], "expected_output": `sum(
    a,
    b,
    c,
    d,
    e
)
`},

  {
      "input_parameters": ["sum(a,b,c,d,e)", "readable", 1], "expected_output":
`sum(
    a,
    b,
    c,
    d,
    e
)
` },

  {
      "input_parameters": ["sum(divideSeries(a, b))", "readable", 1], "expected_output":
`sum(
    divideSeries(
        a,
        b
    )
)
`
  },

  {
      "input_parameters": ["sum(a, {b, c})", "readable", 1], "expected_output":
`sum(
    a,
    {
        b,
        c
    }
)
`
  },

  {
      "input_parameters": ["alias(scale(divideSeries(sum({staging, userverlua}*gce-sc*.userver.requests.path.bidswitch_bid.preprocess.count), sum({staging, userverlua}*gce-sc*.userver.requests.path.bidswitch_bid.preprocess.count, {staging, userverlua}*gce-sc*.userver.requests.path.bidswitch_bid.count)), 100), 'dropped ratio (test)')", "readable", 1], "expected_output":
`alias(
    scale(
        divideSeries(
            sum(
                {
                    staging,
                    userverlua
                }*gce-sc*.userver.requests.path.bidswitch_bid.preprocess.count
            ),
            sum(
                {
                    staging,
                    userverlua
                }*gce-sc*.userver.requests.path.bidswitch_bid.preprocess.count,
                {
                    staging,
                    userverlua
                }*gce-sc*.userver.requests.path.bidswitch_bid.count
            )
        ),
        100
    ),
    'dropped ratio (test)'
)
`
  },
  
];

tests.forEach(function(test, index, array) {
    process.stdout.write("running test [" + index + "]: ");

    var nestedCallOutput = formatNestedCall(
        test.input_parameters[0],
        test.input_parameters[1],
        test.input_parameters[2]
        );

    if (nestedCallOutput.out_str != test.expected_output) {
        process.stdout.write("failed!\n");
        process.stdout.write("expected:\n" + test.expected_output + "\n======\n");
        process.stdout.write("got:\n" + nestedCallOutput.out_str + "\n======\n");
    }
    else {
        process.stdout.write("OK.\n");
//        process.stdout.write("got:\n" + nestedCallOutput.out_str + "\n======\n");
    }
});

