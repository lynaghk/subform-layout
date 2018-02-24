var app = function(width, height){
  return React.createElement("div", {layout: {mode: "self-directed",
                                              horizontal: {size: width},
                                              vertical: {size: height}},
                                     childrenLayout: {mode: "stack-horizontal"}},

                             React.createElement("div"),
                             React.createElement("div", {layout: {main: {before: 20, size: 50, after: 20},
                                                                  cross: {before: 10, size: "1s", after: 10}}}),
                             React.createElement("div"));
};


//This function loads and compiles the web assembly layout engine; callback is given function w/ same signature as ReactDOM.render.
subform_init_react_layout(function(render){

  render(app(400, 400), document.getElementById("container"));

  //Hold control key and zoom mouse around to get a sense of perf
  window.addEventListener("mousemove", function(e){
    if(e.ctrlKey){
      render(app(e.clientX, e.clientY), document.getElementById("container"));
    }
  });

});
