// app.js

// 1. Helper to pick file icons by extension
function fileType(filename) {
  if (filename.endsWith('.docx')) return 'docx';
  if (filename.endsWith('.xlsx')) return 'xlsx';
  if (filename.endsWith('.png'))  return 'png';
  if (filename.endsWith('.zip'))  return 'zip';
  return 'file';
}

// 2. Your folder structure as an array of nodes,
//    assigning `type` dynamically for files.
const treeData = [
  { id: "catfiles",       parent: "#",        text: "catfiles",                      type: "folder" },

  { id: "final_list",     parent: "catfiles", text: "finalfinal_list_of_cats.txt",   type: fileType("finalfinal_list_of_cats.txt") },

  { id: "julia",          parent: "catfiles", text: "julia",                          type: "folder" },
  { id: "febhealth",      parent: "julia",    text: "febhealth.docx",                type: fileType("febhealth.docx") },

  { id: "new_folder",     parent: "catfiles", text: "New folder",                    type: "folder" },
  { id: "meowdata",       parent: "new_folder", text:"meowdata2_final.xlsx",         type: fileType("meowdata2_final.xlsx") },

  { id: "photos2023",     parent: "catfiles", text: "photos2023",                    type: "folder" },
  { id: "img001",         parent: "photos2023", text:"IMG001.png",                    type: fileType("IMG001.png") },

  { id: "stuff",          parent: "catfiles", text: "Stuff",                         type: "folder" },
  { id: "notes_new_cats", parent: "stuff",    text:"Notes About New Cats.docx",      type: fileType("Notes About New Cats.docx") },
  { id: "spreadsheetcopy5", parent: "stuff",  text:"spreadsheetcopy5.xlsx",          type: fileType("spreadsheetcopy5.xlsx") },

  { id: "temp",           parent: "catfiles", text: "temp",                          type: "folder" },
  { id: "photos_zip",     parent: "temp",      text:"photos.zip",                    type: fileType("photos.zip") }
];

// 3. Initialize jsTree with DnD, custom icons & context menu
$('#file-tree').jstree({
  core: {
    data: treeData,
    check_callback: true
  },
  types: {
    folder: { icon: "fas fa-folder-open" },
    file:   { icon: "fas fa-file" },
    docx:   { icon: "fas fa-file-word" },
    xlsx:   { icon: "fas fa-file-excel" },
    png:    { icon: "fas fa-file-image" },
    zip:    { icon: "fas fa-file-archive" }
  },
  plugins: ["dnd", "contextmenu", "types"],
  contextmenu: {
    items: node => {
      const tree = $('#file-tree').jstree(true);
      return {
        create_folder: {
          label: "➕ New Folder",
          action: () => tree.create_node(node, { type: "folder" })
        },
        rename: {
          label: "✏️ Rename",
          action: () => tree.edit(node)
        },
        delete: {
          label: "🗑️ Delete",
          action: () => tree.delete_node(node)
        }
      };
    }
  }
})
.on('create_node.jstree rename_node.jstree move_node.jstree delete_node.jstree',
    (e, data) => console.log("Tree changed:", data.node));
