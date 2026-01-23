function filterSettings() {
  const allBtn = document.querySelector("[data-all-btn]");
  const filterList = document.querySelector("[data-filter-list]");
  if (!allBtn || !filterList) return;

  // Prepend the all button to the filter list
  filterList.prepend(allBtn);

  // Function to update .c-filter-close display based on checkboxes
  function updateFilterClose(label) {
    const checkbox = label.querySelector("input[type='checkbox']");
    const closeBtn = label.querySelector(".c-filter-close");
    if (!checkbox || !closeBtn) return;

    closeBtn.style.display = checkbox.checked ? "flex" : "none";
  }

  // Check if any checkbox is selected
  function updateAllBtnCurrent() {
    const anyChecked = filterList.querySelector(
      "input[type='checkbox']:checked",
    );
    if (!anyChecked) {
      allBtn.classList.add("current");
    }
  }

  // Initial setup for all labels
  const labels = filterList.querySelectorAll(".c-filter-item label");
  labels.forEach((label) => updateFilterClose(label));

  // Click on "All" button
  allBtn.addEventListener("click", () => {
    labels.forEach((label) => {
      const checkbox = label.querySelector("input[type='checkbox']");
      if (checkbox) checkbox.checked = false;
      updateFilterClose(label);

      // Remove .current from all labels
      label.classList.remove("current");
    });

    // Set .current on allBtn
    allBtn.classList.add("current");
  });

  // Handle changes on checkboxes
  filterList.addEventListener("change", (e) => {
    const target = e.target;
    if (target.type !== "checkbox") return;

    const parentLabel = target.closest("label");
    if (parentLabel) updateFilterClose(parentLabel);

    // Remove .current from allBtn if any checkbox is checked
    if (target.checked) {
      allBtn.classList.remove("current");
    }

    // Recheck if no checkbox is selected
    updateAllBtnCurrent();
  });

  // Initial check on page load
  updateAllBtnCurrent();
}

// Run on DOMContentLoaded
document.addEventListener("DOMContentLoaded", filterSettings);
