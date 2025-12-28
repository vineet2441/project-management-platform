package com.projectmanagement.service;

import com.projectmanagement.model.*;
import com.projectmanagement.repository.CollaboratorRepository;
import com.projectmanagement.repository.ProjectRepository;
import com.projectmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CollaboratorService {
        @Autowired
        private CollaboratorRepository collaboratorRepository;
        @Autowired
        private ProjectRepository projectRepository;
        @Autowired
        private UserRepository userRepository;

        private Project ensureOwner(String ownerUsername, Long projectId) {
                User owner = userRepository.findByUsername(ownerUsername)
                                .orElseThrow(() -> new RuntimeException("User not found"));
                Project project = projectRepository.findByIdAndOwnerId(projectId, owner.getId())
                                .orElseThrow(() -> new RuntimeException("Project not found or access denied"));
                return project;
        }

        public Collaborator addCollaborator(String ownerUsername, Long projectId, String collaboratorUsername,
                        CollaboratorRole role) {
                Project project = ensureOwner(ownerUsername, projectId);
                User user = userRepository.findByUsername(collaboratorUsername)
                                .orElseThrow(() -> new RuntimeException("Collaborator user not found"));
                if (collaboratorRepository.existsByProjectAndUser(project, user)) {
                        throw new RuntimeException("User already collaborator");
                }
                Collaborator c = new Collaborator();
                c.setProject(project);
                c.setUser(user);
                c.setRole(role == CollaboratorRole.OWNER ? CollaboratorRole.MAINTAINER : role);
                return collaboratorRepository.save(c);
        }

        public void removeCollaborator(String ownerUsername, Long projectId, Long collaboratorId) {
                Project project = ensureOwner(ownerUsername, projectId);
                Collaborator c = collaboratorRepository.findById(collaboratorId)
                                .orElseThrow(() -> new RuntimeException("Collaborator not found"));
                if (!c.getProject().getId().equals(project.getId())) {
                        throw new RuntimeException("Not a collaborator on this project");
                }
                collaboratorRepository.delete(c);
        }

        public List<Collaborator> listCollaborators(String requesterUsername, Long projectId) {
                // owner or collaborator can list; public projects also allow listing without
                // auth at controller layer if needed
                User req = userRepository.findByUsername(requesterUsername)
                                .orElseThrow(() -> new RuntimeException("User not found"));
                Project project = projectRepository.findById(projectId)
                                .orElseThrow(() -> new RuntimeException("Project not found"));
                boolean allowed = project.getOwner().getId().equals(req.getId()) ||
                                collaboratorRepository.findByProjectAndUser(project, req).isPresent();
                if (!allowed)
                        throw new RuntimeException("Access denied");
                return collaboratorRepository.findByProject(project);
        }

        public boolean canManageGit(String username, Long projectId) {
                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new RuntimeException("User not found"));
                Project project = projectRepository.findById(projectId)
                                .orElseThrow(() -> new RuntimeException("Project not found"));

                // Owner can always manage git
                if (project.getOwner().getId().equals(user.getId())) {
                        return true;
                }

                // Maintainers can also manage git
                return collaboratorRepository.findByProjectAndUser(project, user)
                                .map(c -> c.getRole() == CollaboratorRole.MAINTAINER)
                                .orElse(false);
        }

        /**
         * Check if user can read/clone a repository.
         * - Public projects: anyone can clone
         * - Private projects: owner or any collaborator can clone
         */
        public boolean canReadGit(String username, Long projectId) {
                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new RuntimeException("User not found"));
                Project project = projectRepository.findById(projectId)
                                .orElseThrow(() -> new RuntimeException("Project not found"));

                // Public projects can be cloned by anyone
                if (project.getVisibility() == ProjectVisibility.PUBLIC) {
                        return true;
                }

                // Private projects: owner or collaborators can clone
                if (project.getOwner().getId().equals(user.getId())) {
                        return true;
                }

                // Any collaborator (MAINTAINER, CONTRIBUTOR, VIEWER) can clone private projects
                return collaboratorRepository.findByProjectAndUser(project, user).isPresent();
        }

        /**
         * Check if user can write to a repository (push, pull, create branches).
         * Only owner and maintainers have write access.
         */
        public boolean canWriteGit(String username, Long projectId) {
                return canManageGit(username, projectId);
        }
}
