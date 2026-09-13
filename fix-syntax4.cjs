const fs = require('fs');
let content = fs.readFileSync('src/pages/AdminPage.tsx', 'utf-8');

// Replace the messed up block:
content = content.replace(
`        )}
        </>
      )}`,
`          </div>
        </>
      )}`
);

fs.writeFileSync('src/pages/AdminPage.tsx', content);
