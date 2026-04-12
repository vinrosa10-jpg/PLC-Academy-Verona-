/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {

// ── USERS (extends _pb_users_auth) ──
const usersCol = db.findCollectionByNameOrId(“users”);
usersCol.schema.addField(new SchemaField({
name: “full_name”, type: “text”, required: true,
options: { min: 2, max: 100 }
}));
usersCol.schema.addField(new SchemaField({
name: “role”, type: “select”, required: true,
options: { maxSelect: 1, values: [“student”,“admin”] }
}));
usersCol.schema.addField(new SchemaField({
name: “profile_type”, type: “text”,
options: { max: 100 }
}));
db.saveCollection(usersCol);

// ── COURSES ──
const courses = new Collection({
name: “courses”,
type: “base”,
listRule: “”,
viewRule: “”,
createRule: “@request.auth.id != ‘’ && @request.auth.role = ‘admin’”,
updateRule: “@request.auth.id != ‘’ && @request.auth.role = ‘admin’”,
deleteRule: “@request.auth.id != ‘’ && @request.auth.role = ‘admin’”,
schema: [
{ name: “title”,       type: “text”,   required: true },
{ name: “description”, type: “text”,   required: true },
{ name: “icon”,        type: “text”,   options: { max: 10 } },
{ name: “level”,       type: “select”, options: { maxSelect:1, values:[“base”,“intermedio”,“avanzato”] } },
{ name: “status”,      type: “select”, options: { maxSelect:1, values:[“disponibile”,“prossimamente”] } },
{ name: “color”,       type: “text” },
{ name: “lessons”,     type: “json” },
{ name: “materials”,   type: “json” },
{ name: “quiz”,        type: “json” },
]
});
db.saveCollection(courses);

// ── REVIEWS ──
const reviews = new Collection({
name: “reviews”,
type: “base”,
listRule: “”,
viewRule: “”,
createRule: “@request.auth.id != ‘’”,
updateRule: “@request.auth.id = author”,
deleteRule: “@request.auth.id = author || @request.auth.role = ‘admin’”,
schema: [
{ name: “author”,      type: “relation”, required: true, options: { collectionId: “*pb_users_auth*”, maxSelect: 1 } },
{ name: “author_name”, type: “text”,   required: true },
{ name: “author_role”, type: “text” },
{ name: “course_name”, type: “text”,   required: true },
{ name: “stars”,       type: “number”, required: true, options: { min:1, max:5 } },
{ name: “text”,        type: “text”,   required: true, options: { min: 20 } },
]
});
db.saveCollection(reviews);

// ── ENROLLMENTS ──
const enrollments = new Collection({
name: “enrollments”,
type: “base”,
listRule: “@request.auth.id != ‘’”,
viewRule: “@request.auth.id != ‘’”,
createRule: “@request.auth.id != ‘’”,
updateRule: “@request.auth.id = user”,
deleteRule: “@request.auth.id = user || @request.auth.role = ‘admin’”,
schema: [
{ name: “user”,            type: “relation”, required: true, options: { collectionId: “*pb_users_auth*”, maxSelect: 1 } },
{ name: “course”,          type: “relation”, required: true, options: { collectionId: “courses”, maxSelect: 1 } },
{ name: “completed_lessons”, type: “json” },
{ name: “quiz_score”,      type: “number”, options: { min:0, max:100 } },
{ name: “progress”,        type: “number”, options: { min:0, max:100 } },
]
});
db.saveCollection(enrollments);

// ── LIVE SESSIONS ──
const live = new Collection({
name: “live_sessions”,
type: “base”,
listRule: “”,
viewRule: “”,
createRule: “@request.auth.role = ‘admin’”,
updateRule: “@request.auth.role = ‘admin’”,
deleteRule: “@request.auth.role = ‘admin’”,
schema: [
{ name: “title”,       type: “text”,     required: true },
{ name: “course”,      type: “relation”, options: { collectionId: “courses”, maxSelect: 1 } },
{ name: “scheduled_at”,type: “date”,     required: true },
{ name: “is_live”,     type: “bool” },
{ name: “description”, type: “text” },
]
});
db.saveCollection(live);

// ── CHAT MESSAGES ──
const chat = new Collection({
name: “chat_messages”,
type: “base”,
listRule: “@request.auth.id != ‘’”,
viewRule: “@request.auth.id != ‘’”,
createRule: “@request.auth.id != ‘’”,
updateRule: “false”,
deleteRule: “@request.auth.role = ‘admin’”,
schema: [
{ name: “user”,       type: “relation”, required: true, options: { collectionId: “*pb_users_auth*”, maxSelect: 1 } },
{ name: “user_name”,  type: “text”,     required: true },
{ name: “session”,    type: “relation”, options: { collectionId: “live_sessions”, maxSelect: 1 } },
{ name: “message”,    type: “text”,     required: true, options: { min:1, max:500 } },
]
});
db.saveCollection(chat);

}, (db) => {
// rollback
[“chat_messages”,“live_sessions”,“enrollments”,“reviews”,“courses”].forEach(n => {
try { db.deleteCollection(db.findCollectionByNameOrId(n)); } catch(e){}
});
});
