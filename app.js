// app.js

// 0. Keep the original structure so “Reset” can restore it
const ORIGINAL_JSON = JSON.parse(JSON.stringify(treeData));
let undoStack = [];

// Helper: take snapshot
function snapshot() {
  const tree  = $('#file-tree').jstree(true);
  undoStack.push(tree.get_json('#', { flat:false }));
  $('#btn-undo').prop('disabled', undoStack.length === 0);
}
$('#file-tree').on(
  'create_node.jstree rename_node.jstree move_node.jstree delete_node.jstree',
  () => snapshot()
);

// 1. Helper to pick types/icons by extension
function fileType(filename) {
  filename = filename.toLowerCase();
  if (filename.endsWith('.docx')) return 'docx';
  if (filename.endsWith('.xlsx')) return 'xlsx';
  if (filename.endsWith('.png'))  return 'png';
  if (filename.endsWith('.zip'))  return 'zip';
  if (filename.endsWith('.txt'))  return 'txt';
  return 'file';
}

// 2. Define your folder structure nodes
const treeData = [
  { id: "catfiles",        parent: "#",         text: "catfiles",                      type: "folder" },
  { id: "final_list",      parent: "catfiles",  text: "finalfinal_list_of_cats.txt",   type: fileType("finalfinal_list_of_cats.txt") },
  { id: "julia",           parent: "catfiles",  text: "julia",                         type: "folder" },
  { id: "febhealth",       parent: "julia",     text: "febhealth.docx",                type: fileType("febhealth.docx") },
  { id: "new_folder",      parent: "catfiles",  text: "New folder",                    type: "folder" },
  { id: "meowdata",        parent: "new_folder",text: "meowdata2_final.xlsx",          type: fileType("meowdata2_final.xlsx") },
  { id: "photos2023",      parent: "catfiles",  text: "photos2023",                    type: "folder" },
  { id: "img001",          parent: "photos2023",text: "IMG001.png",                    type: fileType("IMG001.png") },
  { id: "stuff",           parent: "catfiles",  text: "Stuff",                         type: "folder" },
  { id: "notes_new_cats",  parent: "stuff",     text: "Notes About New Cats.docx",     type: fileType("Notes About New Cats.docx") },
  { id: "spreadsheetcopy5",parent: "stuff",     text: "spreadsheetcopy5.xlsx",         type: fileType("spreadsheetcopy5.xlsx") },
  { id: "temp",            parent: "catfiles",  text: "temp",                          type: "folder" },
  { id: "photos_zip",      parent: "temp",      text: "photos.zip",                    type: fileType("photos.zip") }
];

// 3. Initialize jsTree
$('#file-tree').jstree({
  core: {
    data: treeData,
    check_callback: true  // allow create, rename, move, delete
  },
  types: {
    folder: { icon: "fas fa-folder-open" },
    file:   { icon: "fas fa-file" },
    docx:   { icon: "fas fa-file-word" },
    xlsx:   { icon: "fas fa-file-excel" },
    png:    { icon: "fas fa-file-image" },
    zip:    { icon: "fas fa-file-archive" },
    txt:    { icon: "fas fa-file-alt" }
  },
  plugins: ["dnd", "contextmenu", "types"]
})
.on('ready.jstree', () => {
  // enable toolbar as soon as tree is ready
  $('#btn-new, #btn-rename, #btn-delete').prop('disabled', false);
})
.on('select_node.jstree deselect_all.jstree', () => {
  // disable rename/delete if nothing selected
  const sel = $('#file-tree').jstree('get_selected', true);
  $('#btn-rename, #btn-delete').prop('disabled', sel.length !== 1);
});

// 4. Toolbar button actions
$('#btn-new').on('click', () => {
  const tree = $('#file-tree').jstree(true);
  const sel = tree.get_selected(true)[0];
  const parent = sel ? sel.id : '#';
  const newNode = tree.create_node(parent, { text: "New folder", type: "folder" });
  tree.edit(newNode);
});

$('#btn-rename').on('click', () => {
  const tree = $('#file-tree').jstree(true);
  const sel = tree.get_selected(true)[0];
  if (sel) tree.edit(sel);  // ✅ works on both files and folders
});

$('#btn-delete').on('click', () => {
  const tree = $('#file-tree').jstree(true);
  const sel = tree.get_selected(true)[0];
  if (sel) tree.delete_node(sel);
});

// Optional: log changes for debugging
$('#file-tree').on('create_node.jstree rename_node.jstree move_node.jstree delete_node.jstree',
  (e, data) => console.log("Changed:", e.type, data.node));

// Toggle open/close when clicking on folder text
$('#file-tree').on("select_node.jstree", (e, data) => {
  const tree = $('#file-tree').jstree(true);
  if (data.node.children.length > 0) {
    tree.toggle_node(data.node);
  }
});

$('#file-tree').on('select_node.jstree deselect_all.jstree', () => {
  const sel = $('#file-tree').jstree('get_selected', true);
  $('#btn-rename, #btn-delete').prop('disabled', sel.length !== 1);
});

// Undo = pop last snapshot and reload it
$('#btn-undo').on('click', () => {
  if (!undoStack.length) return;
  const last = undoStack.pop();
  $('#btn-undo').prop('disabled', undoStack.length === 0);
  $('#file-tree').jstree(true).settings.core.data = last;
  $('#file-tree').jstree(true).refresh(false, true);   // keep open state
});

// Reset = wipe history, restore ORIGINAL_JSON
$('#btn-reset').on('click', () => {
  undoStack.length = 0;
  $('#btn-undo').prop('disabled', true);
  $('#file-tree').jstree(true).settings.core.data = JSON.parse(JSON.stringify(ORIGINAL_JSON));
  $('#file-tree').jstree(true).refresh(false, true);
});
