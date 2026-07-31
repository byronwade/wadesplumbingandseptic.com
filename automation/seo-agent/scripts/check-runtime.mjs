const major = Number.parseInt(process.versions.node.split('.')[0], 10);
if (major < 24) {
  console.error(`Eve SEO agent CI requires Node 24 or newer; found ${process.versions.node}.`);
  process.exit(1);
}
console.log(`Node runtime accepted: ${process.versions.node}`);
