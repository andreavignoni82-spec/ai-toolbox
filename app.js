document.addEventListener("DOMContentLoaded", () => {
  const views = document.querySelectorAll(".view");
  const navLinks = document.querySelectorAll(".nav-link");
  const yearSpan = document.getElementById("year");

  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  function showView(id) {
    views.forEach((v) => v.classList.remove("active"));
    const el = document.getElementById(id);
    if (el) {
      el.classList.add("active");
    }
  }

  function activateNav(viewId) {
    navLinks.forEach((link) => {
      const target = link.dataset.view;
      if (!target) return;
      if (target === "home" && viewId === "home-view") {
        link.classList.add("active");
      } else if (target === "tools" && viewId === "tools-view") {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const view = link.dataset.view;
      if (view === "home") {
        showView("home-view");
        activateNav("home-view");
      } else if (view === "tools") {
        showView("tools-view");
        activateNav("tools-view");
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  document.querySelectorAll("[data-view-target]").forEach((el) => {
    el.addEventListener("click", () => {
      const target = el.dataset.viewTarget;
      if (!target) return;
      if (target === "tools-view") {
        showView("tools-view");
        activateNav("tools-view");
      } else if (target === "home-view") {
        showView("home-view");
        activateNav("home-view");
      } else {
        showView(target);
        activateNav(""); // inside a tool
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  // Background remover demo
  const bgInput = document.getElementById("bg-input");
  const bgPreview = document.getElementById("bg-preview");
  if (bgInput && bgPreview) {
    bgInput.addEventListener("change", () => {
      const file = bgInput.files && bgInput.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        bgPreview.src = e.target && e.target.result ? e.target.result : "";
      };
      reader.readAsDataURL(file);
    });
  }

  // Face upscaler visual demo
  const faceInput = document.getElementById("face-input");
  const facePreview = document.getElementById("face-preview");
  const faceLevel = document.getElementById("face-level");

  function updateFaceFilter() {
    if (!facePreview) return;
    const level = faceLevel ? parseInt(faceLevel.value, 10) || 0 : 40;
    const factor = 1 + level / 200; // 1.0 - 1.5
    facePreview.style.filter = `contrast(${factor}) saturate(${factor}) sharpen(0.2)`;
  }

  if (faceInput && facePreview) {
    faceInput.addEventListener("change", () => {
      const file = faceInput.files && faceInput.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        facePreview.src = e.target && e.target.result ? e.target.result : "";
        updateFaceFilter();
      };
      reader.readAsDataURL(file);
    });
  }

  if (faceLevel) {
    faceLevel.addEventListener("input", updateFaceFilter);
  }

  // Meme generator (canvas)
  const memeInput = document.getElementById("meme-input");
  const memeTop = document.getElementById("meme-top");
  const memeBottom = document.getElementById("meme-bottom");
  const memeGenerate = document.getElementById("meme-generate");
  const memeDownload = document.getElementById("meme-download");
  const memeCanvas = document.getElementById("meme-canvas");
  let memeImage = null;

  if (memeCanvas) {
    memeCanvas.width = 800;
    memeCanvas.height = 600;
  }

  if (memeInput && memeCanvas) {
    memeInput.addEventListener("change", () => {
      const file = memeInput.files && memeInput.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        memeImage = new Image();
        memeImage.onload = () => {
          renderMeme();
        };
        memeImage.src = e.target && e.target.result ? e.target.result : "";
      };
      reader.readAsDataURL(file);
    });
  }

  function renderMeme() {
    if (!memeCanvas) return;
    const ctx = memeCanvas.getContext("2d");
    if (!ctx) return;

    const topText = (memeTop && memeTop.value) || "";
    const bottomText = (memeBottom && memeBottom.value) || "";

    // background
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, memeCanvas.width, memeCanvas.height);

    // draw image centered
    if (memeImage) {
      const ratio = Math.min(
        memeCanvas.width / memeImage.width,
        memeCanvas.height / memeImage.height
      );
      const newWidth = memeImage.width * ratio;
      const newHeight = memeImage.height * ratio;
      const x = (memeCanvas.width - newWidth) / 2;
      const y = (memeCanvas.height - newHeight) / 2;
      ctx.drawImage(memeImage, x, y, newWidth, newHeight);
    }

    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;
    ctx.font = "bold 42px Impact, system-ui, sans-serif";

    if (topText) {
      const top = topText.toUpperCase();
      ctx.strokeText(top, memeCanvas.width / 2, 60);
      ctx.fillText(top, memeCanvas.width / 2, 60);
    }

    if (bottomText) {
      const bottom = bottomText.toUpperCase();
      ctx.strokeText(bottom, memeCanvas.width / 2, memeCanvas.height - 30);
      ctx.fillText(bottom, memeCanvas.width / 2, memeCanvas.height - 30);
    }
  }

  if (memeGenerate) {
    memeGenerate.addEventListener("click", () => {
      renderMeme();
    });
  }

  if (memeDownload && memeCanvas) {
    memeDownload.addEventListener("click", () => {
      const link = document.createElement("a");
      link.download = "meme.png";
      link.href = memeCanvas.toDataURL("image/png");
      link.click();
    });
  }

  // Instagram post generator demo
  const igTopic = document.getElementById("ig-topic");
  const igTone = document.getElementById("ig-tone");
  const igLength = document.getElementById("ig-length");
  const igGenerate = document.getElementById("ig-generate");
  const igResult = document.getElementById("ig-result");
  const igCopy = document.getElementById("ig-copy");
  const igCopyHint = document.getElementById("ig-copy-hint");

  if (igGenerate && igTopic && igTone && igLength && igResult) {
    igGenerate.addEventListener("click", () => {
      const topic = igTopic.value.trim() || "our brand";
      const tone = igTone.value;
      const length = igLength.value;

      let opener = "";
      if (tone === "friendly") {
        opener = `Hey there! Today we're talking about ${topic} 💫`;
      } else if (tone === "funny") {
        opener = `POV: you can't stop thinking about ${topic} 😂`;
      } else if (tone === "professional") {
        opener = `Let's talk about ${topic} and how it can improve your day.`;
      } else if (tone === "motivational") {
        opener = `Remember: every step counts. Today, it's all about ${topic} 💪`;
      }

      let bodyShort = `• Why it matters right now\n• How it can change your routine\n• One simple action you can take today`;
      let bodyMedium = `${bodyShort}\n\nDrop a comment and tell us: what does ${topic} mean to you?`;
      let bodyLong = `${bodyMedium}\n\nSave this post to revisit when you need a little push and share it with someone who needs it too.`;

      let body = bodyMedium;
      if (length === "short") body = bodyShort;
      if (length === "long") body = bodyLong;

      const callToAction = `\n\nFollow for more tips like this 🔁`;

      const caption = `${opener}\n\n${body}${callToAction}`;
      igResult.value = caption;
      if (igCopyHint) igCopyHint.textContent = "";
    });
  }

  if (igCopy && igResult && igCopyHint) {
    igCopy.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(igResult.value || "");
        igCopyHint.textContent = "Caption copied ✔";
      } catch (err) {
        igCopyHint.textContent =
          "Unable to copy automatically. Select and copy manually.";
      }
    });
  }

  // Summarizer demo
  const sumInput = document.getElementById("sum-input");
  const sumLength = document.getElementById("sum-length");
  const sumGenerate = document.getElementById("sum-generate");
  const sumResult = document.getElementById("sum-result");

  if (sumGenerate && sumInput && sumLength && sumResult) {
    sumGenerate.addEventListener("click", () => {
      const text = (sumInput.value || "").trim();
      if (!text) {
        sumResult.value = "Please paste some text to summarize.";
        return;
      }
      const sentences = text.split(/(?<=[.!?])\s+/);
      if (sentences.length <= 3) {
        sumResult.value = text;
        return;
      }
      const mode = sumLength.value;
      let factor = 0.4;
      if (mode === "short") factor = 0.25;
      if (mode === "long") factor = 0.7;

      const keepCount = Math.max(3, Math.round(sentences.length * factor));
      const summary = sentences.slice(0, keepCount).join(" ");
      sumResult.value = summary;
    });
  }

  // Resume builder demo
  const cvName = document.getElementById("cv-name");
  const cvTitle = document.getElementById("cv-title");
  const cvSummary = document.getElementById("cv-summary");
  const cvExp = document.getElementById("cv-exp");
  const cvEdu = document.getElementById("cv-edu");
  const cvSkills = document.getElementById("cv-skills");
  const cvGenerate = document.getElementById("cv-generate");
  const cvResult = document.getElementById("cv-result");
  const cvCopy = document.getElementById("cv-copy");
  const cvCopyHint = document.getElementById("cv-copy-hint");

  if (
    cvName &&
    cvTitle &&
    cvSummary &&
    cvExp &&
    cvEdu &&
    cvSkills &&
    cvGenerate &&
    cvResult
  ) {
    cvGenerate.addEventListener("click", () => {
      const name = (cvName.value || "Your Name").trim();
      const title = (cvTitle.value || "Your role").trim();
      const summary = (cvSummary.value || "").trim();
      const expLines = (cvExp.value || "").split("\n").filter((l) => l.trim());
      const eduLines = (cvEdu.value || "").split("\n").filter((l) => l.trim());
      const skills = (cvSkills.value || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      let result = `${name.toUpperCase()}\n${title}\n\nPROFILE\n${
        summary || "Brief professional summary goes here."
      }\n\nEXPERIENCE\n`;

      if (expLines.length) {
        expLines.forEach((line) => {
          result += `- ${line}\n`;
        });
      } else {
        result += "- Role – Company – Years\n";
      }

      result += "\nEDUCATION\n";
      if (eduLines.length) {
        eduLines.forEach((line) => {
          result += `- ${line}\n`;
        });
      } else {
        result += "- Degree – Institution – Year\n";
      }

      result += "\nSKILLS\n";
      if (skills.length) {
        result += skills.join(", ");
      } else {
        result += "List of your skills";
      }

      cvResult.value = result;
      if (cvCopyHint) cvCopyHint.textContent = "";
    });
  }

  if (cvCopy && cvResult && cvCopyHint) {
    cvCopy.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(cvResult.value || "");
        cvCopyHint.textContent = "CV copied ✔";
      } catch (err) {
        cvCopyHint.textContent =
          "Unable to copy automatically. Select and copy manually.";
      }
    });
  }

  // Hashtag generator demo
  const tagTopic = document.getElementById("tag-topic");
  const tagPlatform = document.getElementById("tag-platform");
  const tagCount = document.getElementById("tag-count");
  const tagGenerate = document.getElementById("tag-generate");
  const tagResult = document.getElementById("tag-result");
  const tagCopy = document.getElementById("tag-copy");
  const tagCopyHint = document.getElementById("tag-copy-hint");

  function slugifyWord(word) {
    return word
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "")
      .replace(/\s+/g, "");
  }

  if (tagGenerate && tagTopic && tagPlatform && tagCount && tagResult) {
    tagGenerate.addEventListener("click", () => {
      const topicRaw = tagTopic.value.trim() || "creator";
      const topicWords = topicRaw.split(/\s+/).map(slugifyWord).filter(Boolean);
      const base = topicWords.length ? topicWords.join("") : "creator";

      const count = parseInt(tagCount.value, 10) || 30;
      const platform = tagPlatform.value;

      const genericSeeds = [
        "life",
        "tips",
        "daily",
        "goals",
        "hack",
        "love",
        "learn",
        "vibes",
      ];
      const platformSuffix =
        platform === "instagram"
          ? ["insta", "reels", "reelitfeelit", "instagood", "instadaily"]
          : platform === "tiktok"
          ? ["tiktok", "fyp", "viral", "tiktokitalia"]
          : platform === "youtube"
          ? ["youtube", "shorts", "youtuber", "ytshorts"]
          : [];

      const hashtags = new Set();

      hashtags.add(`#${base}`);
      hashtags.add(`#${base}life`);
      hashtags.add(`#${base}daily`);
      hashtags.add(`#${base}community`);

      genericSeeds.forEach((seed) => {
        hashtags.add(`#${base}${seed}`);
        hashtags.add(`#${seed}${base}`);
      });

      platformSuffix.forEach((suffix) => {
        hashtags.add(`#${base}${suffix}`);
        hashtags.add(`#${suffix}${base}`);
      });

      const extra = ["inspiration", "focus", "journey", "challenge", "routine"];
      extra.forEach((e) => {
        hashtags.add(`#${base}${e}`);
      });

      const final = Array.from(hashtags).slice(0, count);
      tagResult.value = final.join(" ");
      if (tagCopyHint) tagCopyHint.textContent = "";
    });
  }

  if (tagCopy && tagResult && tagCopyHint) {
    tagCopy.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(tagResult.value || "");
        tagCopyHint.textContent = "Hashtags copied ✔";
      } catch (err) {
        tagCopyHint.textContent =
          "Unable to copy automatically. Select and copy manually.";
      }
    });
  }

  // Grammar helper demo
  const gramInput = document.getElementById("gram-input");
  const gramResult = document.getElementById("gram-result");
  const gramFix = document.getElementById("gram-fix");

  if (gramFix && gramInput && gramResult) {
    gramFix.addEventListener("click", () => {
      let text = (gramInput.value || "").trim();
      if (!text) {
        gramResult.value = "Please paste some text to clean.";
        return;
      }
      // collapse multiple spaces
      text = text.replace(/\s+/g, " ");
      // ensure space after punctuation when missing
      text = text.replace(/([.!?])(\w)/g, "$1 $2");
      // capitalize first letter
      text = text.charAt(0).toUpperCase() + text.slice(1);
      // ensure final punctuation
      if (!/[.!?]$/.test(text)) {
        text += ".";
      }
      gramResult.value = text;
    });
  }
});
