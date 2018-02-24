var $canvas = document.getElementById("container");
var ctx = $canvas.getContext("2d");


//Recursively draw all nodes on the <canvas> element.
var render_node = function(nodes, node_id, parent_x, parent_y){
  var node = nodes[node_id];
  var gl = node.groundLayout;

  var node_x = parent_x + gl.horizontal.before;
  var node_y = parent_y + gl.vertical.before;

  node.childrenIds.forEach(function(child_id){
    render_node(nodes, child_id, node_x, node_y);
  });

  ctx.strokeRect(node_x, node_y, gl.horizontal.size, gl.vertical.size);
}


//Render tree of nodes
var render = function(width, height, layout_fn){

  $canvas.width = width;
  $canvas.height = height;

  //Define layout as a tree of objects
  var tree = {layout: {mode: "self-directed",
                       horizontal: {size: width},
                       vertical: {size: height}},

              childrenLayout: {mode: "grid",
                               rows: {beforeFirst: 10, between: 20, afterLast: 10},
                               cols: {beforeFirst: 10, between: 40, afterLast: 10, sizes: [50, "2s", "1s"]}},

              children: [{layout: {rowSpan: 2}},

                         {layout: {rowIdx: 0, colIdx: 1},
                          childrenLayout: {mode: "stack-horizontal",
                                           mainBeforeFirst: "1s",
                                           mainBetween: 10,
                                           mainAfterLast: "50%"},
                          children: [{}, {}, {}]},

                         {layout: {rowIdx: 1, colIdx: 2},
                          children: [{layout: {cross: {before: 0}}},
                                     {},
                                     {layout: {cross: {after: 0}}}]}]};

  //Low-level API into layout engine requires nodes be given as an array of objects.
  //Rather than `children`, each object should have `childrenIds`, an array of indexes to other nodes in the array.
  //The artboard should be the last node in the array.
  var nodes = tree_to_array(tree);

  var solved_nodes = layout_fn(nodes);

  //Start drawing recursively from the artboard (the last node in the array).
  render_node(solved_nodes, solved_nodes.length-1, 0, 0);

}


//Convert a tree of objects into the low-level array required by the layout engine.
var tree_to_array = function(artboard){
  var nodes = [];

  var process_tree_node = function(node){
    node.childrenIds = (node.children || []).map(process_tree_node);
    nodes.push(node)
    return nodes.length-1;
  }

  process_tree_node(artboard);

  return nodes;
}


/////////////////////
// Main function

subform_init_layout(function(layout_fn){

  render(400, 400, layout_fn);

  //Hold control key and zoom mouse around to get a sense of perf.
  window.addEventListener("mousemove", function(e){
    if(e.ctrlKey){
      render(e.clientX, e.clientY, layout_fn);
    }
  });

});
