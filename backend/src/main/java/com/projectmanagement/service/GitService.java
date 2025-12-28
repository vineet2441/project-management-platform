package com.projectmanagement.service;

import com.projectmanagement.model.Project;
import com.projectmanagement.repository.ProjectRepository;
import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.ListBranchCommand;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.eclipse.jgit.lib.Constants;
import org.eclipse.jgit.lib.Ref;
import org.eclipse.jgit.storage.file.FileRepositoryBuilder;
import org.eclipse.jgit.transport.CredentialsProvider;
import org.eclipse.jgit.transport.UsernamePasswordCredentialsProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GitService {

    @Value("${git.repos.root:./data/repos}")
    private String reposRoot;

    @Autowired
    private ProjectRepository projectRepository;

    private Path repoPath(Long projectId, String username) {
        return Path.of(reposRoot, username, "project-" + projectId);
    }

    @Deprecated
    private Path repoPath(Long projectId) {
        // Legacy method - kept for compatibility if needed
        return Path.of(reposRoot, "project-" + projectId);
    }

    private CredentialsProvider creds(String username, String password) {
        if (username == null || username.isBlank())
            return CredentialsProvider.getDefault();
        return new UsernamePasswordCredentialsProvider(username, password == null ? "" : password);
    }

    private Git openOrInit(Path path) throws IOException, GitAPIException {
        File dir = path.toFile();
        if (new File(dir, ".git").exists()) {
            return Git.open(dir);
        }
        Files.createDirectories(path);
        return Git.init().setDirectory(dir).call();
    }

    public String cloneOrAttach(Long projectId, String remoteUrl, String branch, String username, String password,
            String currentUsername) throws Exception {
        Project p = projectRepository.findById(projectId).orElseThrow(() -> new RuntimeException("Project not found"));
        Path path = repoPath(p.getId(), currentUsername);
        File dir = path.toFile();
        if (dir.exists() && new File(dir, ".git").exists()) {
            try (Git git = Git.open(dir)) {
                if (remoteUrl != null && !remoteUrl.isBlank()) {
                    // set origin if missing
                    if (git.getRepository().getRemoteNames().stream().noneMatch(r -> r.equals("origin"))) {
                        git.remoteAdd().setName("origin").setUri(new org.eclipse.jgit.transport.URIish(remoteUrl))
                                .call();
                    }
                }
                if (branch != null && !branch.isBlank()) {
                    git.checkout().setName(branch).setCreateBranch(false).call();
                }
                return dir.getAbsolutePath();
            }
        } else {
            Files.createDirectories(path.getParent() == null ? Path.of(".") : path.getParent());
            CredentialsProvider cp = creds(username, password);
            try (Git git = Git.cloneRepository()
                    .setURI(remoteUrl)
                    .setDirectory(dir)
                    .setCredentialsProvider(cp)
                    .setBranch(branch != null && !branch.isBlank() ? branch : null)
                    .call()) {
                return dir.getAbsolutePath();
            }
        }
    }

    public List<String> listBranches(Long projectId, String currentUsername) throws Exception {
        Path path = repoPath(projectId, currentUsername);
        File dir = path.toFile();
        if (!dir.exists() || !new File(dir, ".git").exists()) {
            return List.of(); // Return empty list if repo not cloned yet
        }
        try (Git git = Git.open(dir)) {
            List<Ref> refs = git.branchList().setListMode(ListBranchCommand.ListMode.ALL).call();
            return refs.stream().map(Ref::getName).collect(Collectors.toList());
        }
    }

    public void createBranch(Long projectId, String branch, String currentUsername) throws Exception {
        Path path = repoPath(projectId, currentUsername);
        File dir = path.toFile();
        if (!dir.exists() || !new File(dir, ".git").exists()) {
            throw new RuntimeException("Repository not cloned yet. Please clone the repository first.");
        }
        try (Git git = Git.open(dir)) {
            git.branchCreate().setName(branch).call();
        }
    }

    public void checkout(Long projectId, String branch, String currentUsername) throws Exception {
        Path path = repoPath(projectId, currentUsername);
        File dir = path.toFile();
        if (!dir.exists() || !new File(dir, ".git").exists()) {
            throw new RuntimeException("Repository not cloned yet. Please clone the repository first.");
        }
        try (Git git = Git.open(dir)) {
            git.checkout().setName(branch).call();
        }
    }

    public void pull(Long projectId, String branch, String username, String password, String currentUsername)
            throws Exception {
        Path path = repoPath(projectId, currentUsername);
        File dir = path.toFile();
        if (!dir.exists() || !new File(dir, ".git").exists()) {
            throw new RuntimeException("Repository not cloned yet. Please clone the repository first.");
        }
        try (Git git = Git.open(dir)) {
            if (branch != null && !branch.isBlank()) {
                git.checkout().setName(branch).call();
            }
            git.pull().setCredentialsProvider(creds(username, password)).call();
        }
    }

    public void push(Long projectId, String branch, String username, String password, String currentUsername)
            throws Exception {
        Path path = repoPath(projectId, currentUsername);
        File dir = path.toFile();
        if (!dir.exists() || !new File(dir, ".git").exists()) {
            throw new RuntimeException("Repository not cloned yet. Please clone the repository first.");
        }
        try (Git git = Git.open(dir)) {
            if (branch != null && !branch.isBlank()) {
                git.checkout().setName(branch).call();
            }
            git.push().setCredentialsProvider(creds(username, password)).call();
        }
    }

    public boolean exists(Long projectId, String currentUsername) {
        return new File(repoPath(projectId, currentUsername).toFile(), ".git").exists();
    }
}
