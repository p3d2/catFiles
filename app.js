/* ------------------------------------------------------------------
   app.js  –  Cat Sandbox Explorer
   --------------------------------
   • Undo + Reset
   • No dropping files into files (unless target is .zip)
   • photos.zip now contains 3 image files
   ------------------------------------------------------------------ */

/* ---------- Helper: assign a custom type for icons & rules ---------- */
function fileType(name) {
  const n = name.toLowerCase();
  if (n.endsWith('.docx')) return 'docx';
  if (n.endsWith('.xlsx')) return 'xlsx';
  if (n.endsWith('.png'))  return 'png';
  if (n.endsWith('.zip'))  return 'zip';
  if (n.endsWith('.txt'))  return 'txt';
  return 'file';
}

/* ---------- Folder / file structure (messy on purpose) -------------- */
const treeData = [
  { id:'catfiles', parent:'#',          text:'catfiles',                         type:'folder' },

  { id:'final_list', parent:'catfiles', text:'finalfinal_list_of_cats.txt',      type:fileType('.txt') },

  { id:'julia',     parent:'catfiles',  text:'julia',                            type:'folder' },
  { id:'febhealth', parent:'julia',     text:'febhealth.docx',                   type:fileType('.docx') },

  { id:'new_folder', parent:'catfiles', text:'New folder',                       type:'folder' },
  { id:'meowdata',   parent:'new_folder',text:'meowdata2_final.xlsx',            type:fileType('.xlsx') },

  { id:'photos2023', parent:'catfiles', text:'photos2023',                       type:'folder' },
  { id:'img001',     parent:'photos2023',text:'IMG001.png',                      type:fileType('.png') },

  { id:'stuff',      parent:'catfiles', text:'Stuff',                            type:'folder' },
  { id:'notes',      parent:'stuff',    text:'Notes About New Cats.docx',        type:fileType('.docx') },
  { id:'sheet',      parent:'stuff',    text:'spreadsheetcopy5.xlsx',            type:fileType('.xlsx') },

  { id:'temp',       parent:'catfiles', text:'temp',                             type:'folder' },
  { id:'zip',        parent:'temp',     text:'photos.zip',                       type:fileType('.zip') },

  /* --- new files inside the zip ------------------------------------ */
  { id:'fluffs',     parent:'zip',      text:'fluffs.png',                       type:fileType('.png') },
  { id:'shadow',     parent:'zip',      text:'shadowwiiii.png',                  type:fileType('.png') },
  { id:'snowie',     parent:'zip',      text:'snowie.png',                       type:fileType('.png') }
];

/* ---------- Undo / Reset bookkeeping -------------------------------- */
const ORIGINAL_JSON = JSON.parse(JSON.stringify(treeData));  // pristine copy
let undoStack = [];

/* Push a snapshot of current tree JSON onto the stack */
function pushSnapshot() {
  const json = $('#file-tree').jstree(true).get_json('#', {flat:false});
  undoStack.push(json);
  $('#btn-undo').prop('disabled', undoStack.length === 0);
}

/* ---------- Init jsTree --------------------------------------------- */
$('#file-tree').jstree({
  core: {
    data: treeData,
    /* block dropping into non-folder, non-zip nodes */
    check_callback(op, node, parent) {
      if (op === 'move_node') {
        return parent.type === 'folder' || parent.type === 'zip';
      }
      return true;
    }
  },
  types: {
    folder:{ icon:'fas fa-folder-open' },
    file:  { icon:'fas fa-file' },
    docx:  { icon:'fas fa-file-word' },
    xlsx:  { icon:'fas fa-file-excel' },
    png:   { icon:'fas fa-file-image' },
    zip:   { icon:'fas fa-file-archive' },
    txt:   { icon:'fas fa-file-alt' }
  },
  plugins:['dnd','contextmenu','types']
})
/* Enable toolbar once tree is ready and take first snapshot */
.on('ready.jstree', () => {
  $('#btn-new,#btn-rename,#btn-delete,#btn-reset').prop('disabled', false);
  pushSnapshot();
})
/* After each structural change, push snapshot */
.on('create_node.jstree rename_node.jstree move_node.jstree delete_node.jstree',
    pushSnapshot)
/* Toggle folder open/close when clicking label */
.on('select_node.jstree', (e, data) => {
  const tree = $('#file-tree').jstree(true);
  if (data.node.children.length) tree.toggle_node(data.node);
})
/* Keep Rename/Delete disabled unless exactly one node selected */
.on('select_node.jstree deselect_all.jstree', () => {
  const sel = $('#file-tree').jstree('get_selected', true);
  $('#btn-rename,#btn-delete').prop('disabled', sel.length !== 1);
});

/* ---------- Toolbar actions ----------------------------------------- */
$('#btn-new').on('click', () => {
  const tree = $('#file-tree').jstree(true);
  const sel  = tree.get_selected(true)[0];

  // Determine parent: fallback to root if nothing selected
  let parent = '#';

  if (sel) {
    const isFolder = sel.type === 'folder' || sel.type === 'zip';
    parent = isFolder ? sel.id : sel.parent;
  }

  // Create new folder and start renaming
  const newNode = tree.create_node(parent, { text: 'New folder', type: 'folder' });
  if (newNode) tree.edit(newNode);
});
$('#btn-rename').on('click', () => {
  const tree = $('#file-tree').jstree(true);
  const sel  = tree.get_selected(true)[0];
  if (sel) tree.edit(sel);
});
$('#btn-delete').on('click', () => {
  const tree = $('#file-tree').jstree(true);
  const sel  = tree.get_selected(true)[0];
  if (sel) tree.delete_node(sel);
});
$('#btn-undo').on('click', () => {
  if (!undoStack.length) return;
  const last = undoStack.pop();
  $('#btn-undo').prop('disabled', undoStack.length === 0);
  $('#file-tree').jstree(true).settings.core.data = last;
  $('#file-tree').jstree(true).refresh(false, true);
});
$('#btn-reset').on('click', () => {
  undoStack.length = 0;
  $('#btn-undo').prop('disabled', true);
  $('#file-tree').jstree(true).settings.core.data = JSON.parse(JSON.stringify(ORIGINAL_JSON));
  $('#file-tree').jstree(true).refresh(false, true);
});

/* ---------- Debug console log (optional) ---------------------------- */
$('#file-tree').on(
  'create_node.jstree rename_node.jstree move_node.jstree delete_node.jstree',
  (e, d) => console.log('[jsTree]', e.type, d.node)
);
