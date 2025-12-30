document.body.style.minHeight = "100vh";
document.body.style.margin = "0";
document.body.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";

const header = document.createElement("header");
header.style.display = "flex";
header.style.alignItems = "center";
header.style.justifyContent = "flex-start";
header.style.padding = "20px 40px";
header.style.backdropFilter = "blur(10px)";
header.style.borderBottom = "1px solid rgba(255, 255, 255, 0.2)";
header.style.position = "sticky";
header.style.top = "0";
header.style.zIndex = "1000";

const nav = document.createElement("nav");
nav.style.display = "flex";
nav.style.gap = "15px";
nav.style.alignItems = "center";

const menuItems: string[] = ["버튼1", "버튼2", "버튼3", "버튼4", "버튼5"];

menuItems.forEach((item: string, index: number) => {
  const btn = document.createElement("button");
  btn.textContent = item;
  btn.style.padding = "12px 30px";
  btn.style.border = "none";
  btn.style.borderRadius = "10px";
  btn.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
  btn.style.border = "1px solid rgba(172, 223, 255, 0.3)";
  btn.style.color = "rgba(126, 206, 255, 0.9)";
  btn.style.fontSize = "15px";
  btn.style.fontWeight = "600";
  btn.style.cursor = "pointer";
  btn.style.transition = "all 0.3s ease";

  if (index === 0) {
    btn.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
    btn.style.borderColor = "rgba(172, 223, 255, 0.5)";
    btn.classList.add("active");
  }

  btn.addEventListener("mouseenter", () => {
    btn.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
    btn.style.color = "rgba(126, 206, 255, 1)";
    btn.style.transform = "translateY(-2px)";
    btn.style.boxShadow = "0 3px 5px rgba(0, 0, 0, 0.1)";
  });

  btn.addEventListener("mouseleave", () => {
    if (btn.classList.contains("active")) {
      btn.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
    } else {
      btn.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
    }
    btn.style.color = "rgba(126, 206, 255, 0.9)";
    btn.style.transform = "translateY(0)";
    btn.style.boxShadow = "none";
  });

  btn.addEventListener("click", () => {
    document.querySelectorAll("nav button").forEach((b: Element) => {
      b.classList.remove("active");
      (b as HTMLButtonElement).style.backgroundColor = "rgba(255, 255, 255, 0.2)";
      (b as HTMLButtonElement).style.borderColor = "rgba(172, 223, 255, 0.3)";
    });
    btn.classList.add("active");
    btn.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
    btn.style.borderColor = "rgba(172, 223, 255, 0.5)";
  });

  nav.appendChild(btn);
});

header.appendChild(nav);
document.body.appendChild(header);