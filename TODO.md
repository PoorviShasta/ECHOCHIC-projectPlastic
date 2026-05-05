# Netlify Static Deploy TODO
Status: ✅ Step 1 COMPLETE

## Progress
- ✅ `auth.js`: Pure client-side mock auth (localStorage). Fully static ✅
- ✅ `signup.html`: Complete multi-step form using auth.js ✅
- ✅ Blog pages (3x): All use `../styles.css`, relative nav links ✅ No issues

## Remaining Steps

### 2. **[PENDING] Fix index.html** 
   - Update gallery img src (`terrazzo trays.jpeg` → `%20` consistent)
   - Disable live socket for chat (static fallback)

### 3. **[PENDING] Complete products.html**
   - Add full 6 product cards w/ `data-category`
   - Ensure filter JS ready

### 4. **[PENDING] Update chat.js**
   - Static mock messages (no backend)

### 5. **[PENDING] Fix login.html**
   - Clean malformed meta/script tags

### 6. **[PENDING] Netlify config**
   - `netlify.toml` + `_redirects`

### 7. **[PENDING] Update DEPLOYMENT.md**

### 8. **TEST** `npx serve .`

### 9. **DEPLOY** Netlify

**Next**: Fix index.html images/chat
