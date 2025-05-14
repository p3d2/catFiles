// app.js
const treeData = [
  // Root folder
  { id: "catfiles",                 parent: "#",          text: "catfiles",                        type: "folder" },

  // Top-level files
  { id: "final_list",               parent: "catfiles",   text: "finalfinal_list_of_cats.txt",     type: "file" },

  // julia folder
  { id: "julia",                    parent: "catfiles",   text: "julia",                           type: "folder" },
  { id: "febhealth",                parent: "julia",      text: "febhealth.docx",                  type: "file" },

  // New folder
  { id: "new_folder",               parent: "catfiles",   text: "New folder",                      type: "folder" },
  { id: "meowdata",                 parent: "new_folder", text: "meowdata2_final.xlsx",            type: "file" },

  // photos2023 folder
  { id: "photos2023",               parent: "catfiles",   text: "photos2023",                      type: "folder" },
  { id: "img001",                   parent: "photos2023", text: "IMG001.png",                      type: "file" },

  // Stuff folder
  { id: "stuff",                    parent: "catfiles",   text: "Stuff",                           type: "folder" },
  { id: "notes_new_cats",           parent: "stuff",      text: "Notes About New Cats.docx",       type: "file" },
  { id: "spreadsheetcopy5",         parent: "stuff",      text: "spreadsheetcopy5.xlsx",           type: "file" },

  // temp folder
  { id: "temp",                     parent: "catfiles",   text: "temp",                            type: "folder" },
  { id: "photos_zip",               parent: "temp",       text: "photos.zip",                      type: "file" }
];

// initialize jsTree (same as before)
$('#file-tree').jstree({
  core: {
    data: treeData,
    check_callback: true
  },
  types: {
    folder: { icon: "jstree-folder" },
    file:   { icon: "jstree-file" }
  },
  plugins: ["dnd", "contextmenu", "types"],
  contextmenu: {
    items: function(node) {
      const tree = $('#file-tree').jstree(true);
      return {
        Create: {
          label: "New Folder",
          action: () => tree.create_node(node, { type: "folder" })
        },
        Rename: {
          label: "Rename",
          action: () => tree.edit(node)
        },
        Delete: {
          label: "Delete",
          action: () => tree.delete_node(node)
        }
      };
    }
  }
})
.on('rename_node.jstree move_node.jstree create_node.jstree delete_node.jstree',
    (e, data) => console.log("Tree changed:", data));
