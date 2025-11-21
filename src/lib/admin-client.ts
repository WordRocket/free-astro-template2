import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Environment check:', {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  url: supabaseUrl,
  allEnv: import.meta.env
});

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(`Missing Supabase environment variables. URL: ${!!supabaseUrl}, Key: ${!!supabaseAnonKey}`);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

let currentView = 'posts';
let editingId: string | null = null;

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

export function formatDate(dateString: string | null): string {
  if (!dateString) return 'Never';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function showError(message: string) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'alert alert-error';
  errorDiv.textContent = message;
  document.body.appendChild(errorDiv);
  setTimeout(() => errorDiv.remove(), 5000);
}

function showSuccess(message: string) {
  const successDiv = document.createElement('div');
  successDiv.className = 'alert alert-success';
  successDiv.textContent = message;
  document.body.appendChild(successDiv);
  setTimeout(() => successDiv.remove(), 3000);
}

export async function loadPosts() {
  try {
    const { data: posts, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:authors(name),
        category:categories(name)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      showError('Failed to load posts: ' + error.message);
      return;
    }

    const content = `
      <div class="page-header">
        <h1 class="page-title">Posts</h1>
        <button class="btn btn-primary" onclick="window.adminActions.showPostForm()">New Post</button>
      </div>
      ${posts && posts.length > 0 ? `
        <div class="card">
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Published</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${posts.map(post => `
                  <tr>
                    <td>${post.title}</td>
                    <td>${post.author?.name || 'No author'}</td>
                    <td>${post.category?.name || 'Uncategorized'}</td>
                    <td>
                      <span class="badge ${post.published ? 'badge-success' : 'badge-warning'}">
                        ${post.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td>${formatDate(post.published_at)}</td>
                    <td>
                      <div class="action-buttons">
                        <button class="btn btn-secondary btn-small" onclick="window.adminActions.editPost('${post.id}')">Edit</button>
                        <button class="btn btn-danger btn-small" onclick="window.adminActions.deletePost('${post.id}', '${post.title.replace(/'/g, "\\'")}')">Delete</button>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      ` : '<div class="empty-state">No posts yet. Click "New Post" to create your first post.</div>'}
    `;

    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.innerHTML = content;
    }
  } catch (err) {
    showError('Unexpected error loading posts: ' + (err instanceof Error ? err.message : String(err)));
  }
}

export function initAdmin() {
  console.log('Admin panel initializing...');
  console.log('Supabase URL:', supabaseUrl);
  console.log('Has Anon Key:', !!supabaseAnonKey);

  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const page = (item as HTMLElement).dataset.page;
      if (page) {
        currentView = page;
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');

        switch (page) {
          case 'posts':
            loadPosts();
            break;
          default:
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
              mainContent.innerHTML = `<div class="page-header"><h1 class="page-title">${page.charAt(0).toUpperCase() + page.slice(1)}</h1></div><div class="card"><p>Coming soon...</p></div>`;
            }
        }
      }
    });
  });

  window.adminActions = {
    showPostForm: () => {
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.innerHTML = '<div class="card"><h2>Create Post Form</h2><p>Form coming soon...</p></div>';
      }
    },
    editPost: (id: string) => {
      console.log('Edit post:', id);
    },
    deletePost: async (id: string, title: string) => {
      if (!confirm(`Are you sure you want to delete "${title}"?`)) {
        return;
      }
      const { error } = await supabase.from('posts').delete().eq('id', id);
      if (error) {
        showError('Failed to delete post: ' + error.message);
      } else {
        showSuccess('Post deleted successfully!');
        loadPosts();
      }
    }
  };

  loadPosts();
}

declare global {
  interface Window {
    adminActions: {
      showPostForm: () => void;
      editPost: (id: string) => void;
      deletePost: (id: string, title: string) => Promise<void>;
    };
  }
}
